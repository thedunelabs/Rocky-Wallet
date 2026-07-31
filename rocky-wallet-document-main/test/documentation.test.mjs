import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const publicPages = [
  "README.md",
  "getting-started/install-extension.md",
  "getting-started/create-wallet.md",
  "getting-started/import-wallet.md",
  "getting-started/backup-recovery-phrase.md",
  "using-the-wallet/home-and-assets.md",
  "using-the-wallet/connect-rocky-exchange.md",
  "using-the-wallet/send-assets.md",
  "using-the-wallet/receive-assets.md",
  "using-the-wallet/offers.md",
  "using-the-wallet/transaction-history.md",
  "using-the-wallet/accounts-and-address-book.md",
  "permissions-and-security/receive-preapproval.md",
  "permissions-and-security/transaction-confirmation.md",
  "permissions-and-security/wallet-security.md",
  "permissions-and-security/recovery-and-reset.md",
  "supported-assets.md",
  "troubleshooting.md",
  "faq.md",
  "developers/README.md",
  "developers/install-sdk.md",
  "developers/connect-wallet.md",
  "developers/assets-and-balances.md",
  "developers/signing-and-transfers.md",
  "developers/api-reference.md",
  "developers/security-boundaries.md",
];

async function read(relativePath) {
  return readFile(resolve(root, relativePath), "utf8");
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        if ([".git", "node_modules", "docs"].includes(entry.name)) {
          return [];
        }

        return markdownFiles(path);
      }

      return entry.isFile() && extname(entry.name) === ".md" ? [path] : [];
    }),
  );

  return files.flat();
}

function stripFencedCodeAndComments(markdown) {
  const withoutComments = markdown.replace(
    /<!--(?:[\s\S]*?-->|[\s\S]*)/g,
    (comment) => comment.replace(/[^\r\n]/g, ""),
  );
  let fence;

  return withoutComments
    .split(/(?<=\n)/)
    .map((line) => {
      const strippedLine = line.replace(/[^\r\n]/g, "");

      if (fence) {
        const closingFence = new RegExp(
          `^[\\t ]{0,3}${fence.character}{${fence.length},}[\\t ]*(?:\\r?\\n)?$`,
        );

        if (closingFence.test(line)) {
          fence = undefined;
        }

        return strippedLine;
      }

      const openingFence = line.match(/^[\t ]{0,3}(`{3,}|~{3,})/);
      if (openingFence) {
        fence = {
          character: openingFence[1][0],
          length: openingFence[1].length,
        };
        return strippedLine;
      }

      return line;
    })
    .join("");
}

function parseInlineDestination(markdown, openingParenthesis) {
  let cursor = openingParenthesis + 1;
  let destination = "";

  while (cursor < markdown.length && /\s/.test(markdown[cursor])) {
    cursor += 1;
  }

  if (markdown[cursor] === "<") {
    cursor += 1;
    let closed = false;

    while (cursor < markdown.length) {
      if (markdown[cursor] === "\\" && cursor + 1 < markdown.length) {
        destination += markdown[cursor + 1];
        cursor += 2;
        continue;
      }
      if (markdown[cursor] === ">") {
        cursor += 1;
        closed = true;
        break;
      }
      if (markdown[cursor] === "\n" || markdown[cursor] === "\r") {
        return undefined;
      }

      destination += markdown[cursor];
      cursor += 1;
    }

    if (!closed) {
      return undefined;
    }
  } else {
    let parenthesisDepth = 0;

    while (cursor < markdown.length) {
      const character = markdown[cursor];

      if (character === "\\" && cursor + 1 < markdown.length) {
        destination += markdown[cursor + 1];
        cursor += 2;
        continue;
      }
      if (character === "(") {
        parenthesisDepth += 1;
        destination += character;
        cursor += 1;
        continue;
      }
      if (character === ")") {
        if (parenthesisDepth === 0) {
          break;
        }

        parenthesisDepth -= 1;
        destination += character;
        cursor += 1;
        continue;
      }
      if (/\s/.test(character) && parenthesisDepth === 0) {
        break;
      }

      destination += character;
      cursor += 1;
    }
  }

  while (cursor < markdown.length && /\s/.test(markdown[cursor])) {
    cursor += 1;
  }

  if (markdown[cursor] === '"' || markdown[cursor] === "'") {
    const quote = markdown[cursor];
    let closed = false;
    cursor += 1;

    while (cursor < markdown.length) {
      if (markdown[cursor] === "\\" && cursor + 1 < markdown.length) {
        cursor += 2;
        continue;
      }
      if (markdown[cursor] === quote) {
        cursor += 1;
        closed = true;
        break;
      }

      cursor += 1;
    }

    if (!closed) {
      return undefined;
    }

    while (cursor < markdown.length && /\s/.test(markdown[cursor])) {
      cursor += 1;
    }
  }

  if (markdown[cursor] !== ")") {
    return undefined;
  }

  return { destination, end: cursor };
}

function markdownDestinations(markdown, source) {
  const content = stripFencedCodeAndComments(markdown);

  assert.doesNotMatch(
    content,
    /^[\t ]{0,3}\[(?:\\.|[^\]\\\r\n])+\]:[\t ]*\S/m,
    `${source} uses a reference-style link definition; use inline links`,
  );
  assert.doesNotMatch(
    content,
    /(?:^|[^\\])!?\[(?:\\.|[^\]\\\r\n])*\][\t ]*(?:\r?\n[\t ]*)?\[(?:\\.|[^\]\\\r\n])*\]/m,
    `${source} uses a reference-style link; use inline links`,
  );

  const destinations = [];

  for (let index = 0; index < content.length; index += 1) {
    const labelStart =
      content[index] === "["
        ? index
        : content[index] === "!" && content[index + 1] === "["
          ? index + 1
          : -1;

    if (labelStart === -1) {
      continue;
    }

    let bracketDepth = 0;
    let labelEnd = -1;

    for (let cursor = labelStart + 1; cursor < content.length; cursor += 1) {
      if (content[cursor] === "\\") {
        cursor += 1;
      } else if (content[cursor] === "[") {
        bracketDepth += 1;
      } else if (content[cursor] === "]" && bracketDepth > 0) {
        bracketDepth -= 1;
      } else if (content[cursor] === "]") {
        labelEnd = cursor;
        break;
      }
    }

    if (labelEnd === -1) {
      continue;
    }

    let openingParenthesis = labelEnd + 1;
    while (/\s/.test(content[openingParenthesis])) {
      openingParenthesis += 1;
    }

    if (content[openingParenthesis] !== "(") {
      index = labelEnd;
      continue;
    }

    const parsed = parseInlineDestination(content, openingParenthesis);
    if (parsed) {
      destinations.push(parsed.destination);
      index = parsed.end;
    }
  }

  return destinations;
}

function resolveLocalDestination(sourceFile, destination) {
  if (!destination || destination.startsWith("#")) {
    return undefined;
  }

  assert.ok(
    !destination.startsWith("/"),
    `${relative(root, sourceFile)} uses a site-root absolute link: ${destination}`,
  );

  const scheme = destination.match(/^([A-Za-z][A-Za-z0-9+.-]*):/);
  if (scheme) {
    assert.notEqual(
      scheme[1].toLowerCase(),
      "file",
      `${relative(root, sourceFile)} uses a forbidden file: URI: ${destination}`,
    );
    return undefined;
  }

  const encodedPath = destination.split(/[?#]/)[0];
  if (!encodedPath) {
    return undefined;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(encodedPath);
  } catch {
    assert.fail(`${relative(root, sourceFile)} has an invalid encoded link: ${destination}`);
  }

  assert.ok(
    !decodedPath.startsWith("/"),
    `${relative(root, sourceFile)} uses a site-root absolute link: ${destination}`,
  );

  const resolvedPath = resolve(dirname(sourceFile), decodedPath);
  const pathFromRoot = relative(root, resolvedPath);
  assert.ok(
    pathFromRoot !== ".." && !pathFromRoot.startsWith(`..${sep}`),
    `${relative(root, sourceFile)} links outside the repository: ${destination}`,
  );

  return resolvedPath;
}

test("every public page exists", async () => {
  await Promise.all(
    publicPages.map(async (page) => {
      const path = resolve(root, page);

      await access(path);
      assert.ok((await stat(path)).isFile(), `${page} must be a regular file`);
    }),
  );
});

test("SUMMARY.md links every public page exactly once", async () => {
  const summary = await read("SUMMARY.md");
  const linkedPages = markdownDestinations(summary, "SUMMARY.md")
    .map((target) => target.split(/[?#]/)[0].replace(/^\.\//, ""))
    .filter((page) => page.endsWith(".md"));

  assert.deepEqual(linkedPages.sort(), [...publicPages].sort());
});

test("all relative Markdown and image links resolve", async () => {
  const fixtureSource = resolve(root, "fixture.md");
  const extractionFixtures = [
    {
      name: "balanced parentheses",
      markdown: "![Dark asset](assets/image_(dark).png)",
      expected: ["assets/image_(dark).png"],
    },
    {
      name: "escaped characters and quoted title",
      markdown: String.raw`[escaped \]](<assets/image\(light\).png> "Light asset")`,
      expected: ["assets/image(light).png"],
    },
    {
      name: "fenced code and HTML comments",
      markdown: [
        "```md",
        "[ignored](/etc/passwd)",
        "```",
        "<!-- [ignored](../outside.md) -->",
        "[kept](guide.md)",
      ].join("\n"),
      expected: ["guide.md"],
    },
  ];
  const rejectedReferenceFixtures = [
    {
      name: "reference link",
      markdown: "[Guide][guide]",
      message: /reference-style link; use inline links/,
    },
    {
      name: "reference definition",
      markdown: "[guide]: guide.md",
      message: /reference-style link definition; use inline links/,
    },
  ];
  const externalDestinations = [
    "https://example.com/docs",
    "mailto:support@example.com",
    "tel:+15555550123",
    "data:image/png;base64,AAAA",
  ];
  const unsafeDestinations = [
    { destination: "/etc/passwd", message: /site-root absolute link/ },
    { destination: "file:///etc/passwd", message: /forbidden file: URI/ },
    { destination: "../outside.md", message: /outside the repository/ },
  ];

  for (const { name, markdown, expected } of extractionFixtures) {
    assert.deepEqual(markdownDestinations(markdown, name), expected, name);
  }
  for (const { name, markdown, message } of rejectedReferenceFixtures) {
    assert.throws(() => markdownDestinations(markdown, name), message, name);
  }
  for (const destination of externalDestinations) {
    assert.equal(resolveLocalDestination(fixtureSource, destination), undefined);
  }
  for (const { destination, message } of unsafeDestinations) {
    assert.throws(
      () => resolveLocalDestination(fixtureSource, destination),
      message,
      destination,
    );
  }
  assert.equal(
    resolveLocalDestination(fixtureSource, "assets/image_(dark).png"),
    resolve(root, "assets/image_(dark).png"),
  );

  for (const file of await markdownFiles(root)) {
    const content = await readFile(file, "utf8");

    for (const target of markdownDestinations(content, relative(root, file))) {
      const path = resolveLocalDestination(file, target);
      if (!path) {
        continue;
      }

      await assert.doesNotReject(
        access(path),
        `${relative(root, file)} links to missing ${target}`,
      );
    }
  }
});

test("public docs do not contain placeholders or credential-shaped secrets", async () => {
  const assignedSecretPatterns = [
    [
      "assigned quoted secret",
      /(?:["'`])?\b(?:private_?key|recovery_?phrase|seed_?phrase|mnemonic)\b(?:["'`])?[\t ]*[:=][\t ]*(?:"[^"\r\n]{16,}"|'[^'\r\n]{16,}'|`[^`\r\n]{16,}`)/i,
    ],
    [
      "assigned unquoted private key",
      /(?:["'`])?\bprivate_?key\b(?:["'`])?[\t ]*[:=][\t ]*(?:0x)?[A-Fa-f0-9]{32,}\b/i,
    ],
    [
      "assigned unquoted recovery phrase",
      /(?:["'`])?\b(?:recovery_?phrase|seed_?phrase|mnemonic)\b(?:["'`])?[\t ]*[:=][\t ]*(?:[a-z]+[\t ]+){11,}[a-z]+\b/i,
    ],
  ];
  const forbidden = [
    ["TBD/TODO placeholder", /\b(?:TBD|TODO)\b/i],
    ["coming soon placeholder", /coming\s+soon/i],
    ["GitHub token", /\bghp_[A-Za-z0-9]{20,}\b/],
    [
      "Bearer credential",
      /\bAuthorization\s*:\s*Bearer\s+(?![<{[])[A-Za-z0-9][A-Za-z0-9._~+/=-]{15,}/i,
    ],
    ...assignedSecretPatterns,
  ];
  const maliciousFixtures = [
    {
      name: "uppercase quoted private key",
      content: 'PRIVATE_KEY = "0123456789abcdef"',
    },
    {
      name: "camel-case unquoted private key",
      content: `privateKey = 0x${"a".repeat(32)}`,
    },
    {
      name: "uppercase unquoted recovery phrase",
      content:
        "RECOVERY_PHRASE = abandon ability able about above absent absorb abstract absurd abuse access accident",
    },
    {
      name: "camel-case quoted recovery phrase",
      content: 'recoveryPhrase: "0123456789abcdef"',
    },
    {
      name: "uppercase quoted seed phrase",
      content: 'SEED_PHRASE = "0123456789abcdef"',
    },
    {
      name: "camel-case unquoted seed phrase",
      content:
        "seedPhrase = abandon ability able about above absent absorb abstract absurd abuse access accident",
    },
    {
      name: "uppercase unquoted mnemonic",
      content:
        "MNEMONIC = abandon ability able about above absent absorb abstract absurd abuse access accident",
    },
    {
      name: "lowercase quoted mnemonic",
      content: 'mnemonic: "0123456789abcdef"',
    },
  ];
  const safeFixtures = [
    "A recovery phrase is required to restore a wallet.",
    "Never share your private key with another person.",
    "PRIVATE_KEY = process.env.PRIVATE_KEY",
    'recoveryPhrase = "1234567890abcde"',
    `privateKey = ${"a".repeat(31)}`,
    "MNEMONIC values must remain private.",
  ];

  for (const { name, content } of maliciousFixtures) {
    assert.ok(
      assignedSecretPatterns.some(([, pattern]) => pattern.test(content)),
      `${name} was not detected`,
    );
  }
  for (const content of safeFixtures) {
    for (const [, pattern] of assignedSecretPatterns) {
      assert.doesNotMatch(content, pattern, `safe fixture was rejected: ${content}`);
    }
  }

  for (const file of await markdownFiles(root)) {
    const content = await readFile(file, "utf8");

    for (const [label, pattern] of forbidden) {
      assert.doesNotMatch(content, pattern, `${relative(root, file)} contains ${label}`);
    }
  }
});

test("developer docs pin the SDK and define its security boundary", async () => {
  const installSdk = await read("developers/install-sdk.md");
  const securityBoundaries = await read("developers/security-boundaries.md");
  const methods = [
    "connect",
    "disconnect",
    "getPrimaryAccount",
    "getCoinsBalance",
    "getAssetCatalog",
    "signMessage",
    "submitCommands",
    "sendTransfer",
    "buildTransfer",
    "getNodeOffers",
  ];

  const publicMethodsSection = securityBoundaries.match(
    /^## Public DApp methods[^\S\r\n]*\r?\n([\s\S]*?)(?=^##(?:\s|$)|(?![\s\S]))/m,
  );

  assert.match(installSdk, /@rocky-wallet\/dapp-sdk@1\.0\.2(?:\s|`|$)/);
  assert.ok(publicMethodsSection, "missing ## Public DApp methods section");
  const documentedMethods = [
    ...publicMethodsSection[1].matchAll(/^[\t ]*-[\t ]+`([^`\r\n]+)`[\t ]*$/gm),
  ].map(([, method]) => method);
  assert.deepEqual(documentedMethods, methods);
  assert.match(
    securityBoundaries,
    /receive preapproval[\s\S]{0,200}Extension-owned/i,
  );
  assert.match(
    securityBoundaries,
    /SDK does not expose[\s\S]{0,200}rocky_get_receive_preapproval[\s\S]{0,200}rocky_set_receive_preapproval/i,
  );
});

test("user docs match the current wallet permission model", async () => {
  const files = await markdownFiles(root);
  const publicContent = (
    await Promise.all(
      files.map(async (file) => readFile(file, "utf8")),
    )
  ).join("\n");
  const receivePreapproval = await read(
    "permissions-and-security/receive-preapproval.md",
  );

  assert.doesNotMatch(publicContent, /(?:Extension|Wallet)\s+(?:v(?:ersion)?\s*)?1\.0\.0\b/i);
  assert.doesNotMatch(publicContent, /Auto Merge UTXOs/i);
  assert.doesNotMatch(
    publicContent,
    /Auto-Receive\s+(?:CC|cETH|USDCx|CBTC|CUSD)\b/i,
  );
  assert.match(receivePreapproval, /registrar-wide coverage/i);
  assert.match(receivePreapproval, /no separate per-asset toggles/i);
});
