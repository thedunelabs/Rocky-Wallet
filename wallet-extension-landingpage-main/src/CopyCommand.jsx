import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyText } from './copyText.js';

export default function CopyCommand({
  command,
  copy = copyText,
  scheduleReset = globalThis.setTimeout,
  cancelReset = globalThis.clearTimeout,
}) {
  const [status, setStatus] = useState('idle');
  const resetTimer = useRef(undefined);
  const mounted = useRef(false);
  const operationGeneration = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      operationGeneration.current += 1;
      if (resetTimer.current !== undefined) {
        cancelReset(resetTimer.current);
        resetTimer.current = undefined;
      }
    };
  }, [cancelReset]);

  async function handleCopy() {
    const generation = operationGeneration.current + 1;
    operationGeneration.current = generation;
    if (resetTimer.current !== undefined) {
      cancelReset(resetTimer.current);
      resetTimer.current = undefined;
    }
    setStatus('copying');

    try {
      await copy(command);
    } catch {
      if (!mounted.current || generation !== operationGeneration.current) return;
      setStatus('error');
      return;
    }

    if (!mounted.current || generation !== operationGeneration.current) return;
    setStatus('copied');
    resetTimer.current = scheduleReset(() => {
      if (!mounted.current || generation !== operationGeneration.current) return;
      resetTimer.current = undefined;
      setStatus('idle');
    }, 2000);
  }

  const buttonLabel = status === 'copying'
    ? 'Copying'
    : status === 'copied'
      ? 'Copied'
      : status === 'error'
        ? 'Retry'
        : 'Copy';
  const statusMessage = status === 'copying'
    ? 'Copying install command.'
    : status === 'copied'
      ? 'Install command copied.'
      : status === 'error'
        ? 'Copy failed — select the command manually'
        : '';

  return <div className="rw-copy-command">
    <span aria-hidden="true">$</span><code>{command}</code>
    <button
      type="button"
      onClick={handleCopy}
      disabled={status === 'copying'}
      aria-label={`${buttonLabel} SDK install command`}
    >
      {status === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span>{buttonLabel}</span>
    </button>
    <span className="rw-copy-status" aria-live="polite">
      {statusMessage}
    </span>
  </div>;
}
