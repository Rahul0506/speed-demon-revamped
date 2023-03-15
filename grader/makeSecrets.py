from random import shuffle

alphabet = "abcdefghijklmnopqrstuvwxyz"
alphabet = alphabet + alphabet.upper() + "0123456789"
alphabet = list(alphabet)

f_names = open("student_names.csv", "r")
f_out = open("secrets_file.csv", "w")

secret_set = set()
for line in f_names.readlines():
    line = line.strip()
    ind = line.index(",A0")
    name = line[:ind].split(",", 1)[1]
    print(name)

    while True:
        shuffle(alphabet)
        secret = "".join(alphabet[:10])
        if secret not in secret_set:
            break
    to_write = name + "," + secret + "\n"
    f_out.write(to_write)

f_names.close()
f_out.close()
