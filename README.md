## Simple CLI to upload CI/CD pipeline artifacts

An example Gitlab usage (gitlab-ci.yml) is...

```yaml
copy artifacts:
  stage: deploy
  dependencies:
    - "build packages"
  script:
    - |
      for file in `find out/make \( -name "*.exe" -o -name "*.dmg" -o -name "*.deb" -o -name "*.rpm" \)`; do
        dest=$(basename $file)
        npx owncloudcli upload $file /loe/$dest
      done
```

Help Output:
```sh
./owncloudCLI.js help
OWNCLOUD_USERNAME env var is unset
OWNCLOUD_PASSWORD env var is unset
OWNCLOUD_URL env var is unset

owncloudcli <cmd> [args]

Commands:
  owncloudcli upload <source> <dest>  Upload source file to owncloud
                                      destination.

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  ```

  Note that the ownlcloud env vars `OWNCLOUD_USERNAME`, `OWNCLOUD_PASSWORD`, and `OWNCLOUD_URL` must be set in your CI/CD config.  Tested on Gitlab but there's no reason it should not work on Github or Jenkins or whatever...