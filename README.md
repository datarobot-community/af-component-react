<p align="center">
  <a href="https://github.com/datarobot-community/af-component-react">
    <img src="https://af.datarobot.com/img/datarobot_logo.avif" width="600px" alt="DataRobot Logo"/>
  </a>
</p>
<p align="center">
    <span style="font-size: 1.5em; font-weight: bold; display: block;">af-component-react</span>
</p>

<p align="center">
  <a href="https://datarobot.com">Homepage</a>
  ·
  <a href="https://af.datarobot.com">Documentation</a>
  ·
  <a href="https://docs.datarobot.com/en/docs/get-started/troubleshooting/general-help.html">Support</a>
</p>

<p align="center">
  <a href="https://github.com/datarobot-community/af-component-react/tags">
    <img src="https://img.shields.io/github/v/tag/datarobot-community/af-component-react?label=version" alt="Latest Release">
  </a>
  <a href="/LICENSE">
    <img src="https://img.shields.io/github/license/datarobot-community/af-component-react" alt="License">
  </a>
  <a href="https://join.slack.com/t/datarobot-community/shared_invite/zt-3uzfp8k50-SUdMqeux25ok9_5wr4okrg">
    <img src="https://img.shields.io/badge/%23applications-a?label=Slack&labelColor=30373D&color=81FBA6" alt="Slack #applications">
  </a>
</p>

The React Frontend Component. Adds a react frontend to an existing fastapi-server component.

`af-component-react` is an App Framework component for developers building DataRobot App Templates who need a ready-made React UI layer wired to a FastAPI backend. It is designed for app developers who want to ship a web interface without hand-rolling the build pipeline and deployment wiring from scratch.

The component ships a React app scaffold, a Vite build pipeline, the [dr-ui](https://dr-ui.datarobot.com/en/docs/) component registry, and the Pulumi infrastructure glue that embeds the compiled frontend into a DataRobot `ApplicationSource`. Because the component is repeatable, you can apply it more than once to add multiple independent React frontends to a single project — each with its own answer file and app name.

The scaffold also bundles an **accessibility** skill under `.agents/skills/accessibility/` — guidance that helps AI coding agents author and review WCAG 2.2 AA-compliant UI (surfaced to Claude via the base component's `.claude/skills` symlink). Alongside it, a `.cursor/BUGBOT.md` inside your frontend directory points [Cursor BugBot](https://cursor.com/bugbot) at that same skill, so the rules also apply at review time. It sits in the frontend directory rather than the repo root so accessibility rules reach UI diffs instead of every PR. The file is a **starting point meant to be edited**, and it ships with a *Repo-specific calibration* section listing what to fill in for your app. Copier tracks it like any other templated file, so your edits are preserved through `copier update` as local modifications. The one exception is a project that already had its own `.cursor/BUGBOT.md` before this template shipped one: that update introduces the file, your version conflicts with it, and copier's default `--conflict=inline` writes conflict markers into your file. Run that particular update with `--conflict=rej` to keep your version intact and get the template's as a `.rej` alongside it.


# Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [UI components (dr-ui)](#ui-components-dr-ui)
- [Component dependencies](#component-dependencies)
  - [Required](#required)
  - [Local development](#local-development)
  - [Updating](#updating)
- [Troubleshooting](#troubleshooting)
- [Next steps and cross-links](#next-steps-and-cross-links)
- [Contributing, changelog, support, and legal](#contributing-changelog-support-and-legal)


# Prerequisites

The following tools are required before applying this component:

- Python 3.11+
- [`uv`](https://docs.astral.sh/uv/) installed
- [`dr`](https://cli.datarobot.com) installed
- Node.js 18+ (required for the React/Vite build)
- The [`base`](https://github.com/datarobot-community/af-component-base) component already applied to your project
- The [`fastapi-backend`](https://github.com/datarobot-community/af-component-fastapi-backend) component already applied to your project


# Quick start

Run the following command in your project directory:

```bash
dr component add https://github.com/datarobot-community/af-component-react .
```

If you need additional control, you can run this to use copier directly:

```bash
uvx copier copy datarobot-community/af-component-react .
```

The copier wizard asks for a `react_app` name (for example, `frontend`). This name namespaces the generated files and answer file.

**Adding a second frontend** — because this component is repeatable, run the command again and supply a different `react_app` name:

```bash
uvx copier copy https://github.com/datarobot-community/af-component-react .
```


# UI components (dr-ui)

The React scaffold ships with [dr-ui](https://dr-ui.datarobot.com/en/docs/) preconfigured — DataRobot's internal [shadcn](https://ui.shadcn.com/) component registry. It includes design [tokens](https://dr-ui.datarobot.com/en/docs/foundation/tokens/), [typography classes](https://dr-ui.datarobot.com/en/docs/foundation/typography/), UI primitives, and higher-level components such as Chat, Grid, etc. Everything is built on shadcn-compatible tokens, so you can theme and customize any component while still inheriting the DataRobot design system by default.

See the [dr-ui documentation](https://dr-ui.datarobot.com/en/docs/) for the component catalog and instructions for adding components to your project.


# Component dependencies

This component depends on other App Framework components that must already be applied before you add the React frontend.

## Required

The following components must be applied to the project **before** this component:

| Name | Repository | Repeatable |
|------|-----------|------------|
| `base` | [https://github.com/datarobot-community/af-component-base](https://github.com/datarobot-community/af-component-base) | No |
| `fastapi-backend` | [https://github.com/datarobot-community/af-component-fastapi-backend](https://github.com/datarobot-community/af-component-fastapi-backend) | No |

## Local development

After applying both this component and `fastapi-backend`, one manual step is required to connect them in the Pulumi infrastructure. In `infra/infra/web.py` (the file generated by the fastapi-backend component), import the React frontend module:

```python
from .REACT_APP_NAME import REACT_APP_NAME
```

Then update the `ApplicationSource` for your FastAPI app to wait for the frontend build before collecting app files:

```diff
FASTAPI_APP_NAME_app_source = pulumi_datarobot.ApplicationSource(
-    files=get_FASTAPI_APP_NAME_app_files(runtime_parameter_values=FASTAPI_APP_NAME_app_runtime_parameters),
+    files=frontend_web.stdout.apply(
+        lambda _: get_FASTAPI_APP_NAME_app_files(
+            runtime_parameter_values=FASTAPI_APP_NAME_app_runtime_parameters
+        )
+    ),
    runtime_parameter_values=FASTAPI_APP_NAME_app_runtime_parameters,
    resources=pulumi_datarobot.ApplicationSourceResourcesArgs(
        resource_label=CustomAppResourceBundles.CPU_XL.value.id,
    ),
    required_key_scope_level=required_key_scope_level,
    **FASTAPI_APP_NAME_app_source_args,
)
```

This ensures the Vite build completes before Pulumi collects the compiled assets for deployment.

### Running locally

Start the Vite dev server from the generated frontend directory:

```bash
cd frontend_REACT_APP_NAME
npm install
npm run dev
```

The dev server proxies API requests to the FastAPI backend running on its configured port. See the generated `vite.config.ts` for proxy settings.

## Updating

All components should be regularly updated to pick up bug fixes, new features, and compatibility with the latest DataRobot App Framework.

For automatic updates to the latest version, run the following command in your project directory:

```bash
dr component update .datarobot/answers/react-REACT_APP_NAME.yml
```

If you need more fine-grained control and prefer using copier directly:

```bash
uvx copier update -a .datarobot/answers/react-REACT_APP_NAME.yml -A
```

To update all copied components at once:

```bash
uvx copier update -a .datarobot/answers/*.yaml -A
```


# Troubleshooting

The most common issues arise when the Pulumi wiring step is incomplete or when Node.js versions are mismatched.

**Frontend assets not included in the deployed app**&mdash;you likely skipped the `ApplicationSource` wiring step. Confirm that `files=` uses `.stdout.apply(...)` rather than calling `get_*_app_files(...)` directly.

**`uvx copier copy` fails on Node version**&mdash;the Vite build requires Node.js 18+. Run `node --version` and upgrade if needed.

**Multiple frontends stomping on each other**&mdash;each `react_app` name must be unique. Check `.datarobot/answers/` — each frontend should have its own `react-NAME.yml` file.

**Copier update overwrites local changes**&mdash;copier tracks which answers you gave and re-applies them during `update`. Place customizations in files that copier does not manage, outside the generated scaffold.


# Next steps and cross-links

After adding the React component, explore the rest of the App Framework ecosystem to extend your application.

- [App Framework documentation](https://af.datarobot.com)&mdash;full reference for components, templates, and deployment.
- [af-component-base](https://github.com/datarobot-community/af-component-base)&mdash;required foundation component.
- [af-component-fastapi-backend](https://github.com/datarobot-community/af-component-fastapi-backend)&mdash;the FastAPI backend this component pairs with.
- [App Framework Studio — Confluence](https://datarobot.atlassian.net/wiki/spaces/BOPS/pages/6542032899/App+Framework+-+Studio)&mdash;internal architecture and design decisions.


# Contributing, changelog, support, and legal

Contributions are welcome. Open a pull request against the `main` branch and run `task lint` before submitting. See [CONTRIBUTING.md](CONTRIBUTING.md) if present.

**Getting help**&mdash;file a GitHub Issue in this repository or reach out via the DataRobot [support portal](https://docs.datarobot.com/en/docs/get-started/troubleshooting/general-help.html).

**License**&mdash;released under the terms in [LICENSE](LICENSE).
