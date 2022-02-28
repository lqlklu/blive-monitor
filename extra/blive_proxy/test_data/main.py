import json

ifn = "superchat.json"
ofn = ifn

with open(ifn, "r") as fi:
    o = json.load(fi)
    print(o)
    with open(ofn, "w") as fo:
        json.dump(o, fo, ensure_ascii=False, indent=2, sort_keys=True)
