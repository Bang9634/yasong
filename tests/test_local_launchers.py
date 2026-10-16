"""Check canonical upload/config paths without starting Java or reading secrets."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent.parent


class LocalEnvironmentTest(unittest.TestCase):
    def configure(self, root, **overrides):
        env = dict(os.environ)
        for name in ['SPRING_PROFILES_ACTIVE', 'SPRING_CONFIG_ADDITIONAL_LOCATION', 'FILE_UPLOAD_DIR']:
            env.pop(name, None)
        env.update(overrides)
        command = f'''ROOT="$1"
source "{ROOT}/scripts/lib/local-env.sh"
configure_local_environment
printf '%s\\n' "$SPRING_PROFILES_ACTIVE" "$FILE_UPLOAD_DIR" "${{SPRING_CONFIG_ADDITIONAL_LOCATION:-}}"
'''
        output = subprocess.check_output(['bash', '-c', command, 'local-environment-test', str(root)], env=env, text=True)
        return output.splitlines()

    def test_local_configuration_and_uploads_do_not_depend_on_callers_directory(self):
        with tempfile.TemporaryDirectory(prefix='yasong local ') as temp:
            root = Path(temp)
            config = root / 'backend/src/main/resources/application-local.properties'
            config.parent.mkdir(parents=True)
            config.write_text('# test only')
            self.assertEqual(self.configure(root), ['local', str(root / 'uploads'), 'file:' + str(config)])

    def test_production_build_does_not_load_private_local_configuration(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            config = root / 'backend/src/main/resources/application-local.properties'
            config.parent.mkdir(parents=True)
            config.write_text('# must not be loaded')
            self.assertEqual(self.configure(root, SPRING_PROFILES_ACTIVE='prod')[2], '')

    def test_explicit_config_and_upload_directory_are_preserved(self):
        result = self.configure(ROOT, SPRING_CONFIG_ADDITIONAL_LOCATION='file:/explicit/config.properties', FILE_UPLOAD_DIR='/explicit/uploads')
        self.assertEqual(result[1:], ['/explicit/uploads', 'file:/explicit/config.properties'])


if __name__ == '__main__':
    unittest.main()
