from Crypto.Cipher import AES
import os
import json


# define Python user-defined exceptions
class InvalidKeyException(Exception):
    "The note cannot be decrypted."
    pass


def encrypt_note(note):
    # Get the key
    with open(os.path.join(os.path.dirname(__file__), 'key.bin'), 'rb') as f:
        key = f.read()

    cipher = AES.new(key, AES.MODE_EAX)

    # Encrypt
    ciphertext, tag = cipher.encrypt_and_digest(str.encode(json.dumps(note)))
    encrypted = [x for x in (cipher.nonce, tag, ciphertext)]
    return b''.join(encrypted)


def decrypt_note(encrypted_msg):
    # Get the key
    with open(os.path.join(os.path.dirname(__file__), 'key.bin'), 'rb') as f:
        key = f.read()
    nonce, tag, ciphertext = encrypted_msg[:
                                           16], encrypted_msg[16:32], encrypted_msg[32:]
    try:
        cipher = AES.new(key, AES.MODE_EAX, nonce)
        data = cipher.decrypt_and_verify(ciphertext, tag)
        return json.dumps(json.loads(data))
    except ValueError:
        raise InvalidKeyException
