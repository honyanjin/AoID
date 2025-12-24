
import random

# 데이터 소스
first_names = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "전", "홍", "고", "문", "양", "손", "배", "조", "백", "허", "유", "남", "심", "노", "하", "곽", "성", "차", "주", "우", "구"]
last_names_1 = ["민", "서", "도", "지", "하", "준", "예", "아", "주", "수", "은", "채", "태", "현", "우", "진", "원", "호", "연", "나", "석", "윤", "훈", "영", "상", "미", "혜", "광", "건", "동"]
last_names_2 = ["준", "윤", "현", "우", "은", "호", "원", "수", "진", "빈", "영", "아", "연", "민", "훈", "석", "찬", "혁", "재", "경", "율", "린", "성", "희", "정", "솜", "솔"]

words = [
    "sky", "blue", "ocean", "tree", "happy", "coding", "cat", "dog", "star", "moon",
    "sun", "flower", "coffee", "music", "art", "game", "book", "food", "movie", "travel",
    "runner", "walker", "dream", "love", "smile", "peace", "king", "queen", "prince", "angel",
    "hero", "zero", "super", "magic", "power", "dragon", "tiger", "lion", "bear", "wolf",
    "eagle", "shark", "whale", "dolphin", "panda", "koala", "fox", "rabbit", "horse", "monkey",
    "apple", "banana", "cherry", "grape", "lemon", "melon", "orange", "peach", "wi", "berry",
    "choco", "mint", "cookie", "cake", "candy", "jelly", "pizza", "burger", "pasta", "salad",
    "urban", "retro", "jazz", "rock", "pop", "soul", "funk", "punk", "indie", "classic",
    "red", "green", "yellow", "purple", "pink", "black", "white", "gray", "silver", "gold",
    "neon", "vivid", "pastel", "dark", "light", "soft", "hard", "sweet", "spicy", "cool",
    "hot", "cold", "warm", "fresh", "clean", "pure", "wild", "mild", "rich", "poor",
    "fast", "slow", "high", "low", "big", "small", "long", "short", "deep", "wide",
    "smart", "wise", "brave", "kind", "cute", "nice", "good", "bad", "sad", "mad",
    "lucky", "lucky", "happy", "sunny", "rainy", "windy", "snowy", "cloudy", "stormy", "foggy"
]

def generate_name():
    return random.choice(first_names) + random.choice(last_names_1) + random.choice(last_names_2)

def generate_id():
    word1 = random.choice(words)
    word2 = random.choice(words)
    suffix = random.choice(["", str(random.randint(1, 99)), str(random.randint(1990, 2025))])
    
    style = random.choice(["concat", "underscore", "underscore_num"])
    
    if style == "concat":
        username = word1 + word2 + suffix
    elif style == "underscore":
        username = word1 + "_" + word2
    else:
        username = word1 + "_" + word2 + suffix
        
    # 언더바가 없는 경우를 위해 가끔 word1 + num 조합도 추가
    if random.random() < 0.3:
        username = word1 + str(random.randint(100, 9999))
        
    return username.lower()

# 500개 데이터 생성
users = []
used_ids = set()

while len(users) < 500:
    uid = generate_id()
    if uid in used_ids:
        continue
    used_ids.add(uid)
    name = generate_name()
    email = f"{uid}@google.com"
    users.append((len(users) + 1, uid, email, name))

# 파일 쓰기
file_path = "c:\\Project\\AoID\\AssetsFlies\\AccMockup\\users.md"

with open(file_path, "w", encoding="utf-8") as f:
    f.write("# 목업용 가계정 데이터 (500개)\n\n")
    f.write("조건:\n")
    f.write("- 아이디: 이름과 무관한 현실적인 랜덤 아이디\n")
    f.write("- 언더바(_) 유무 혼합\n")
    f.write("- 이메일: 아이디@google.com\n")
    f.write("- 이름: 한국인 이름 (랜덤)\n\n")
    f.write("| No. | 아이디 (ID) | 이메일 (Email) | 이름 (Name) |\n")
    f.write("|:---:|:---|:---|:---:| \n")
    
    for user in users:
        f.write(f"| {user[0]} | `{user[1]}` | `{user[2]}` | {user[3]} |\n")

print(f"Successfully generated 500 users in {file_path}")
