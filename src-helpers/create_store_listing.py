import glob
import os

template_for_store = """
	{
		parsed: false,
		source: {
			type: 'audio',
			type:'static',
			sources: [
				{
					src: '/||filename||',
					type: 'audio/mp3'
				}
			]
		}
	},
"""

for file in glob.glob(f"static{os.path.sep}*.mp3"):
    f = file.split(os.path.sep)[-1]
    print(template_for_store.replace("||filename||", f))