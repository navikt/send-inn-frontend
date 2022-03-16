file = open("VedleggsListe.tsx", "r")

output = ""
def is_ascii(s):
    return all(ord(c) < 128 for c in s)

for line in file:

    for character in line:
        if (is_ascii(character) or character in ['æ', 'ø', 'å']):
            output+=character

print(output)

with open("output.txt", "a") as o:
    o.write(output)