from Crypto.Random import get_random_bytes
import os

with open(os.path.join(os.path.dirname(__file__), 'key.bin'), 'wb') as f:
    f.write(get_random_bytes(32))
