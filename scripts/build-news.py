# Chuyển src/tintuc.txt -> src/data/news-posts.json (chạy lại khi nội dung đổi)
import json, re, unicodedata, sys

SRC = "src/tintuc.txt"
OUT = "src/data/news-posts.json"
L = [l.rstrip("\n") for l in open(SRC, encoding="utf8").read().split("\n")]

GROUPS = {
    "thương hiệu và truyền thống": "Thương hiệu & Truyền thống",
    "thông tin sản phẩm": "Thông tin sản phẩm",
    "tin cậy & minh bạch": "Tin cậy & Minh bạch",
    "cách sử dụng": "Cách sử dụng",
    "thông tin mua hàng": "Thông tin mua hàng",
}
# (dòng bắt đầu bảng, số cột) - bảng kết thúc ở dòng trống tiếp theo
TABLES = {260: 2, 370: 2, 430: 3, 499: 2, 566: 2, 721: 3, 829: 3, 886: 2,
          997: 3, 1210: 2, 1243: 4, 1281: 2, 1362: 4}

# dòng dẫn (1-based) -> số mục danh sách theo sau (đã đối chiếu thủ công với file nguồn)
LISTS = {245: 5, 280: 5, 363: 3, 454: 4, 556: 5, 580: 5, 591: 4, 600: 5, 607: 5,
         646: 3, 663: 4, 697: 4, 763: 8, 948: 4, 971: 5, 1025: 3, 1032: 5,
         1061: 5, 1076: 5, 1092: 5, 1107: 4, 1122: 5,
         1159: 4, 1168: 3, 1176: 4, 1184: 4, 1192: 4, 1201: 4, 1263: 5,
         1299: 5, 1321: 6, 1348: 4}

def slugify(s):
    s = s.replace("đ", "d").replace("Đ", "D")
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    if len(s) > 70:
        s = s[:70].rsplit("-", 1)[0]
    return s

# --- tóm tắt cho 13 bài đầu (mục 3 của file) ---
summaries = {}
i = 17
while i < 46:
    m = re.match(r"Bài \d+: (.+)", L[i].strip())
    if m and i + 1 < len(L) and L[i + 1].startswith("Tóm tắt:"):
        summaries[m.group(1).strip()] = L[i + 1].split(":", 1)[1].strip()
        i += 2
    else:
        i += 1

# --- tách bài ---
posts = []
group = None
i = 49
n = len(L)
starts = []  # (line_index, group)
while i < n:
    s = L[i].strip()
    if s.lower() in GROUPS:
        group = GROUPS[s.lower()]
    elif re.match(r"^\.?Bài\s*\d+", s):
        # tiêu đề ở dòng kế tiếp không rỗng
        j = i + 1
        while not L[j].strip():
            j += 1
        starts.append((i, j, group))
        i = j
    i += 1

def is_heading_like(s):
    return (len(s) <= 110 and not re.search(r"[.:;,]$", s) and not s.startswith("Bước"))

PARA_OPEN = re.compile(r"^(Nếu|Mã |Khi |Tuy nhiên|Do đó|Vì vậy|Đây |Việc |Điều |Hãy |Bạn có thể|Lưu ý|Sau |Không |Một |Những |Với |Đó |Chính |Thông tin |Tìm hiểu|Khám phá|Dưới đây|Ví dụ|Có thể phân biệt)")

for k, (si, ti, grp) in enumerate(starts):
    end = starts[k + 1][0] if k + 1 < len(starts) else n
    # cắt tên nhóm của bài kế tiếp nằm cuối đoạn
    title = L[ti].strip()
    body_idx = list(range(ti + 1, end))
    blocks = []
    refs = []
    related = []
    mode = None  # None | 'refs' | 'related'
    idx = 0
    lines = [(b + 1, L[b].strip()) for b in body_idx]  # (số dòng 1-based, text)

    def last_is_list():
        return blocks and blocks[-1]["t"] == "ul"

    p = 0
    while p < len(lines):
        ln, s = lines[p]
        if not s:
            p += 1
            continue
        low = s.lower()
        if s.lower() in GROUPS:  # tên nhóm bài kế tiếp
            break
        if low in ("tài liệu tham khảo", "nguồn tham khảo"):
            mode = "refs"; p += 1; continue
        if low.startswith("gợi ý đọc thêm"):
            mode = "related"; p += 1; continue
        if mode == "refs":
            refs.append(s); p += 1; continue
        if mode == "related":
            related.append(s); p += 1; continue
        # bảng
        if ln in TABLES:
            nc = TABLES[ln]
            cells = []
            while p < len(lines) and lines[p][1]:
                cells.append(lines[p][1]); p += 1
            rows = [cells[x:x + nc] for x in range(0, len(cells), nc)]
            blocks.append({"t": "table", "head": rows[0], "rows": rows[1:]})
            continue
        # tiêu đề
        if low == "kết luận":
            blocks.append({"t": "h2", "text": s}); p += 1; continue
        if re.match(r"^\d+\.\d+\.\s", s):
            blocks.append({"t": "h3", "text": s}); p += 1; continue
        if re.match(r"^\d+\.\s", s) and len(s) <= 130:
            blocks.append({"t": "h2", "text": s}); p += 1; continue
        if re.match(r"^Hiểu lầm \d+:", s):
            blocks.append({"t": "h3", "text": s}); p += 1; continue
        # danh sách theo đặc tả thủ công: tiêu đề/câu dẫn ở dòng ln, n mục kế tiếp
        if ln in LISTS and not s.startswith("Bước"):
            kind = "p" if (s.endswith(":") or len(s) > 110 or s.endswith(".")) else "h3"
            blocks.append({"t": kind, "text": s})
            items = []
            q = p + 1
            while len(items) < LISTS[ln] and q < len(lines):
                if lines[q][1]:
                    items.append(lines[q][1])
                q += 1
            ordered = all(re.match(r"^Bước \d+:", it) for it in items)
            blocks.append({"t": "ol" if ordered else "ul", "items": items})
            p = q
            continue
        if re.search(r"(=|→)", s) and len(s) < 200 and not s.endswith(":"):
            blocks.append({"t": "formula", "text": s}); p += 1; continue
        if s.startswith("Bước") and re.match(r"^Bước \d+:", s):
            if len(s) > 60 or re.search(r"[.?]$", s):
                if blocks and blocks[-1]["t"] == "ol":
                    blocks[-1]["items"].append(s)
                else:
                    blocks.append({"t": "ol", "items": [s]})
            else:
                blocks.append({"t": "h3", "text": s})
            p += 1; continue
        # nhãn: nội dung ngắn trong chuỗi "Label: text." liên tiếp -> danh sách
        if re.match(r"^[^.:?]{3,36}: .+\.$", s) and not s.startswith(("Lưu ý", "Ví dụ", "Nguyên liệu cho")):
            if last_is_list() and blocks[-1].get("lab"):
                blocks[-1]["items"].append(s)
            else:
                blocks.append({"t": "ul", "items": [s], "lab": True})
            p += 1; continue
        if is_heading_like(s) and not re.match(r"^(Thứ|Nguyên liệu cho)", s):
            blocks.append({"t": "h3", "text": s}); p += 1; continue
        blocks.append({"t": "p", "text": s})
        p += 1

    for b in blocks:
        if b.get("lab") and len(b["items"]) == 1:
            b["t"] = "note"; b["text"] = b.pop("items")[0]
        b.pop("lab", None)
    posts.append({
        "title": title, "group": grp, "blocks": blocks,
        "refs": refs, "related": related, "src_line": ti + 1,
    })

# --- trường phụ ---
for pst in posts:
    pst["slug"] = slugify(pst["title"])
    words = sum(len(re.findall(r"\S+", b.get("text", " ".join(b.get("items", []))))) for b in pst["blocks"])
    pst["readMinutes"] = max(1, round(words / 200))
    first_p = next((b["text"] for b in pst["blocks"] if b["t"] == "p"), "")
    if pst["title"] in summaries:
        pst["excerpt"] = summaries[pst["title"]]
    else:
        ex = first_p
        if len(ex) > 170:
            cut = ex[:170].rsplit(" ", 1)[0]
            ex = cut + "…"
        pst["excerpt"] = ex

json.dump(posts, open(OUT, "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(posts), "bài")
for pst in posts:
    print(pst["src_line"], pst["group"], "|", pst["title"][:70], "|", len(pst["blocks"]), "blocks", pst["readMinutes"], "ph", "|", pst["slug"])
