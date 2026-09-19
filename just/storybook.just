# Storybook local defaults. Override with environment variables or recipe args.
storybook_port := env_var_or_default("STORYBOOK_PORT", "6006")
storybook_host := env_var_or_default("STORYBOOK_HOST", "127.0.0.1")

# Install Storybook dependencies and prepare generated local assets.
storybook-setup:
    #!/usr/bin/env bash
    cd ui
    yarn install --frozen-lockfile
    mkdir -p src/styles/generated
    yarn build:css
    test -f .storybook/main.ts
    test -f .storybook/preview.tsx
    echo "Storybook setup complete."

# Check that local Storybook dependencies and files are present.
storybook-doctor:
    #!/usr/bin/env bash
    cd ui
    node - <<'NODE'
    const pkg = require('./package.json');
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const required = [
      'storybook',
      '@storybook/react-webpack5',
      '@storybook/preset-create-react-app',
      '@storybook/addon-docs',
      '@storybook/addon-a11y',
      '@chromatic-com/storybook',
    ];
    const missing = required.filter(name => !deps[name]);
    if (missing.length) {
      console.error(`Missing Storybook dependencies: ${missing.join(', ')}`);
      process.exit(1);
    }
    NODE
    test -f .storybook/main.ts
    test -f .storybook/preview.tsx
    test -d src/app/components/app-shell
    echo "Storybook local setup looks ready."

# Run Storybook locally. Override with STORYBOOK_HOST and STORYBOOK_PORT.
storybook host=storybook_host port=storybook_port: storybook-setup
    cd ui && STORYBOOK_DISABLE_TELEMETRY=1 ./node_modules/.bin/storybook dev --host "{{host}}" --port "{{port}}"

# Build static Storybook docs locally.
storybook-build: storybook-setup
    cd ui && STORYBOOK_DISABLE_TELEMETRY=1 ./node_modules/.bin/storybook build

# Remove generated Storybook output and generated UI CSS.
storybook-clean:
    rm -rf ui/storybook-static ui/src/styles/generated/tailwindcss.css
