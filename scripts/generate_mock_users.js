
const fs = require('fs');
const path = require('path');

// 데이터 소스
const firstNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "전", "홍", "고", "문", "양", "손", "배", "조", "백", "허", "유", "남", "심", "노", "하", "곽", "성", "차", "주", "우", "구"];
const lastNames1 = ["민", "서", "도", "지", "하", "준", "예", "아", "주", "수", "은", "채", "태", "현", "우", "진", "원", "호", "연", "나", "석", "윤", "훈", "영", "상", "미", "혜", "광", "건", "동"];
const lastNames2 = ["준", "윤", "현", "우", "은", "호", "원", "수", "진", "빈", "영", "아", "연", "민", "훈", "석", "찬", "혁", "재", "경", "율", "린", "성", "희", "정", "솜", "솔"];

const words = [
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
    "lucky", "happy", "sunny", "rainy", "windy", "snowy", "cloudy", "stormy", "foggy"
];

function generateName() {
    return getRandom(firstNames) + getRandom(lastNames1) + getRandom(lastNames2);
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateId() {
    const word1 = getRandom(words);
    const word2 = getRandom(words);
    const suffix = Math.random() < 0.5 ? "" : (Math.random() < 0.5 ? Math.floor(Math.random() * 99) : Math.floor(Math.random() * (2025 - 1990) + 1990));

    const style = Math.random();
    let username = "";

    if (style < 0.33) {
        username = word1 + word2 + suffix;
    } else if (style < 0.66) {
        username = word1 + "_" + word2;
    } else {
        username = word1 + "_" + word2 + suffix;
    }

    // 언더바가 없는 경우 (word + num)
    if (Math.random() < 0.3) {
        username = word1 + Math.floor(Math.random() * 9999);
    }

    return username.toLowerCase();
}

// 500개 데이터 생성
const users = [];
const usedIds = new Set();

while (users.length < 500) {
    const uid = generateId();
    if (usedIds.has(uid)) continue;
    usedIds.add(uid);
    const name = generateName();
    const email = `${uid}@google.com`;
    users.push({ no: users.length + 1, id: uid, email: email, name: name });
}

// 파일 쓰기
const filePath = path.join("c:\\Project\\AoID\\AssetsFlies\\AccMockup\\users.md");
let content = "# 목업용 가계정 데이터 (500개)\n\n";
content += "조건:\n";
content += "- 아이디: 이름과 무관한 현실적인 랜덤 아이디\n";
content += "- 언더바(_) 유무 혼합\n";
content += "- 이메일: 아이디@google.com\n";
content += "- 이름: 한국인 이름 (랜덤)\n\n";
content += "| No. | 아이디 (ID) | 이메일 (Email) | 이름 (Name) |\n";
content += "|:---:|:---|:---|:---:| \n";

users.forEach(user => {
    content += `| ${user.no} | \`${user.id}\` | \`${user.email}\` | ${user.name} |\n`;
});

fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
        console.error("Error writing file:", err);
        process.exit(1);
    }
    console.log(`Successfully generated 500 users in ${filePath}`);
});
