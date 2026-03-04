# af-component-react

The React Frontend One-to-Many component from [App Framework Studio](https://github.com/datarobot/app-framework-studio)

Covers the basic structure and answers needed to have a basic React app that is deployable as part of an App Template

* Part of https://datarobot.atlassian.net/wiki/spaces/BOPS/pages/6542032899/App+Framework+-+Studio


## Instructions

To start for a repo:

`uvx copier copy https://github.com/datarobot/af-component-react .`

If a template requires multiple React frontends, it can be used multiple times with a different answer to the `react_app` question.

To work, it expects the base component https://github.com/datarobot/af-component-base has already been installed. To do that first, run:

`uvx copier copy https://github.com/datarobot/af-component-base .`

and it also needs a web host as the backend to the frontend:

`uvx copier copy https://github.com/datarobot/af-component-fastapi-backend .`


To update

`uvx copier update -a .datarobot/answers/react-{{ react_app }}.yml -A`

To update all templates that are copied:

`uvx copier update -a .datarobot/answers/*.yaml -A`

### Sibling with fastapi-backend

When pairing with https://github.com/datarobot/af-component-fastapi-backend there is a manual step to make the integration fully compatible. In `infra/infra/web.py` / the fastapi server component name, you'll need to import the react component you want:

```python
from .{{ react_app_name }} import {{ react_app_name }}
```


And then down in the files for the ApplicationSource, you need to change this line:
```diff
{{fastapi_app_name}}_app_source = pulumi_datarobot.ApplicationSource(
-    files=get_{{fastapi_app_name}}_app_files(runtime_parameter_values={{fastapi_app_name}}_app_runtime_parameters),
+    files=frontend_web.stdout.apply(
+        lambda _: get_{{fastapi_app_name}}_app_files((
+            runtime_parameter_values={{fastapi_app_name}}_app_runtime_parameters
+        )
+    ),
    runtime_parameter_values={{fastapi_app_name}}_app_runtime_parameters,
    resources=pulumi_datarobot.ApplicationSourceResourcesArgs(
        resource_label=CustomAppResourceBundles.CPU_XL.value.id,
    ),
    required_key_scope_level=required_key_scope_level,
    **{{fastapi_app_name}}_app_source_args,
)
```
