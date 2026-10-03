import os, shutil, glob
base = 'android/app/src/main'
mf = base + '/AndroidManifest.xml'
m = open(mf, encoding='utf-8').read()
perms = ['ACCESS_NETWORK_STATE','ACCESS_COARSE_LOCATION','ACCESS_FINE_LOCATION','RECORD_AUDIO','MODIFY_AUDIO_SETTINGS','CAMERA','POST_NOTIFICATIONS','VIBRATE','READ_MEDIA_IMAGES','READ_MEDIA_VIDEO']
add = ''.join('    <uses-permission android:name="android.permission.%s"/>\n' % p for p in perms if 'permission.%s"' % p not in m)
add += '    <uses-feature android:name="android.hardware.camera" android:required="false"/>\n    <uses-feature android:name="android.hardware.microphone" android:required="false"/>\n'
m = m.replace('<application', add + '    <application', 1)
open(mf, 'w', encoding='utf-8').write(m)
try:  # icone WEARLY
    shutil.rmtree(base + '/res/mipmap-anydpi-v26', ignore_errors=True)
    for d in glob.glob(base + '/res/mipmap-*dpi'):
        for n in ('ic_launcher.png', 'ic_launcher_round.png'):
            shutil.copy('resources/icon.png', os.path.join(d, n))
except Exception as e:
    print('icone ignoree', e)
print('manifest patched')
