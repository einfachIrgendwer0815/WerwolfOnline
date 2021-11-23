import secrets

def generate():
    return secrets.token_hex()

if __name__ == "__main__":
    print(generate())