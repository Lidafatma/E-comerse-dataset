"""Olist E-commerce Admin Dashboard (Streamlit).
Jalankan:  pip install -r requirements.txt  &&  streamlit run app.py
Letakkan CSV Olist di folder ./data (atau ubah path di sidebar).
"""
from pathlib import Path

import pandas as pd
import plotly.express as px
import streamlit as st

st.set_page_config(page_title="Olist Admin Dashboard", page_icon="🛍️", layout="wide")

PALETTE = ["#38bdf8", "#34d399", "#fbbf24", "#f472b6", "#a78bfa", "#64748b"]
TOP_STATES = ["SP", "MG", "PR", "RJ", "SC"]

# ---------- Glassmorphism dark theme ----------
st.markdown(
    """
<style>
.stApp{background:linear-gradient(135deg,#020617 0%,#0b2538 55%,#0e4a5e 100%);color:#fff}
[data-testid="stSidebar"]{background:rgba(15,23,42,.65);backdrop-filter:blur(16px);border-right:1px solid rgba(255,255,255,.1)}
[data-testid="stHeader"]{background:transparent}
[data-testid="stMetric"]{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:18px;
  padding:16px 18px;backdrop-filter:blur(14px);box-shadow:0 8px 32px rgba(0,0,0,.35);transition:all .3s ease}
[data-testid="stMetric"]:hover{transform:translateY(-4px);background:rgba(255,255,255,.1);box-shadow:0 0 28px rgba(56,189,248,.28)}
[data-testid="stMetricLabel"]{color:rgba(255,255,255,.7)}
[data-testid="stMetricValue"]{color:#fff;font-weight:700}
[data-testid="stMetricDelta"]{color:rgba(255,255,255,.45)!important}
div[role="radiogroup"]{gap:4px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);padding:4px;border-radius:999px;width:fit-content}
div[role="radiogroup"] label{padding:4px 14px;border-radius:999px}
.glass{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:6px 14px;backdrop-filter:blur(14px)}
h1,h2,h3{color:#fff!important}
</style>
""",
    unsafe_allow_html=True,
)


# ---------- Data ----------
@st.cache_data(show_spinner="Memuat & mengolah data Olist…")
def load(folder: str):
    d = Path(folder)
    items = pd.read_csv(d / "order_items_dataset.csv")
    prod = pd.read_csv(d / "products_dataset.csv")
    trans = pd.read_csv(d / "product_category_name_translation.csv")
    sell = pd.read_csv(d / "sellers_dataset.csv")
    pay = pd.read_csv(d / "order_payments_dataset.csv")
    rev = pd.read_csv(d / "order_reviews_dataset.csv")

    items = (
        items.merge(prod[["product_id", "product_category_name"]], on="product_id", how="left")
        .merge(trans, on="product_category_name", how="left")
        .merge(sell[["seller_id", "seller_state"]], on="seller_id", how="left")
    )
    items["category"] = (
        items["product_category_name_english"].fillna(items["product_category_name"]).fillna("unknown")
    )
    # Tidak ada tabel orders -> bulan diambil dari shipping_limit_date
    items["month"] = items["shipping_limit_date"].str[:7]
    items = items[(items["month"] >= "2017-01") & (items["month"] <= "2018-08")]

    order_month = items.groupby("order_id")["month"].first().rename("month")
    order_cat = items.groupby("order_id")["category"].first().rename("category")
    pay = pay[pay["payment_type"] != "not_defined"].merge(order_month, on="order_id")
    rev = rev.merge(order_month, on="order_id").merge(order_cat, on="order_id")
    return items, pay, rev


def brl(x: float) -> str:
    return "R$ {:,.0f}".format(x).replace(",", ".")


def num(x: float) -> str:
    return "{:,.0f}".format(x).replace(",", ".")


def style(fig, h=340):
    fig.update_layout(
        height=h, paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        font_color="#cbd5e1", margin=dict(l=10, r=10, t=30, b=10), legend_title_text="",
    )
    fig.update_xaxes(showgrid=False)
    fig.update_yaxes(gridcolor="rgba(255,255,255,.08)")
    return fig


# ---------- Sidebar ----------
with st.sidebar:
    st.markdown("## 🛍️ Olist Admin")
    folder = st.text_input("Folder data CSV", "data")
    min_reviews = st.slider("Min. jumlah review (kategori rating terendah)", 1, 100, 1)
    st.caption("Sumbu waktu = bulan dari `shipping_limit_date` (tabel orders tidak tersedia).")

try:
    items, pay, rev = load(folder)
except FileNotFoundError as e:
    st.error(f"File tidak ditemukan: {e.filename}. Letakkan CSV Olist di folder `{folder}`.")
    st.stop()

# ---------- Header + time filter ----------
months = sorted(items["month"].unique())
h1, h2 = st.columns([3, 2])
with h1:
    st.title("E-commerce Overview")
with h2:
    st.write("")
    choice = st.radio("Rentang waktu", ["3 bulan", "6 bulan", "12 bulan", "Semua"], index=1, horizontal=True)
n = {"3 bulan": 3, "6 bulan": 6, "12 bulan": 12, "Semua": len(months)}[choice]
win = months[-n:]
st.caption(f"Olist marketplace · {win[0]} → {win[-1]}")

it = items[items["month"].isin(win)]
pw = pay[pay["month"].isin(win)]
rw = rev[rev["month"].isin(win)]

# ---------- Charts row ----------
cat = it.groupby("category")["price"].sum().sort_values(ascending=False)
c1, c2 = st.columns([2, 1])
with c1:
    mode = st.radio("Kategori", ["Top 5", "Bottom 5"], horizontal=True, label_visibility="collapsed")
    sel = cat.head(5) if mode == "Top 5" else cat[cat > 0].tail(5)
    fig = px.bar(
        sel.reset_index(), x="category", y="price", text_auto=".3s",
        color_discrete_sequence=["#38bdf8" if mode == "Top 5" else "#f472b6"],
        labels={"category": "", "price": "Revenue (BRL)"}, title=f"{mode} kategori berdasarkan revenue",
    )
    fig.update_traces(marker_cornerradius=8, hovertemplate="%{x}<br>R$ %{y:,.0f}<extra></extra>")
    st.plotly_chart(style(fig), use_container_width=True)
with c2:
    st_cnt = it["seller_state"].where(it["seller_state"].isin(TOP_STATES), "Other").value_counts().reset_index()
    st_cnt.columns = ["state", "items"]
    sp_share = st_cnt.loc[st_cnt["state"] == "SP", "items"].sum() / st_cnt["items"].sum()
    fig = px.pie(st_cnt, names="state", values="items", hole=0.62, color_discrete_sequence=PALETTE,
                 title="Distribusi seller state")
    fig.update_traces(textinfo="percent", marker_line_width=0)
    fig.add_annotation(text=f"<b>{sp_share:.1%}</b><br>SP", showarrow=False, font=dict(size=16, color="#fff"))
    st.plotly_chart(style(fig), use_container_width=True)

# ---------- KPI cards ----------
n_items, n_orders, revenue = len(it), it["order_id"].nunique(), it["price"].sum()
sp_items = int((it["seller_state"] == "SP").sum())
ptype = pw["payment_type"].value_counts()
avg_score = rw["review_score"].mean()
five = (rw["review_score"] == 5).mean()
one = (rw["review_score"] == 1).mean()

k = st.columns(4)
k[0].metric("Total revenue", brl(revenue), f"Top: {cat.index[0].replace('_', ' ')}")
k[1].metric("Total transaksi (item)", num(n_items), f"SP: {num(sp_items)} ({sp_items / n_items:.1%})")
k[2].metric("Credit card", num(ptype.get("credit_card", 0)), f"{ptype.get('credit_card', 0) / ptype.sum():.1%} dari pembayaran")
k[3].metric("Rata-rata review", f"{avg_score:.2f} / 5", f"{five:.1%} bintang 5")
k = st.columns(4)
k[0].metric("Jumlah order", num(n_orders), f"AOV {brl(revenue / n_orders)}")
k[1].metric("Boleto", num(ptype.get("boleto", 0)), f"{ptype.get('boleto', 0) / ptype.sum():.1%} dari pembayaran")
k[2].metric("Rata-rata cicilan", f"{pw['payment_installments'].mean():.2f}", "per catatan pembayaran")
k[3].metric("Review 1★", f"{one:.1%}", f"{num((rw['review_score'] == 1).sum())} review")

st.write("")
# ---------- Reviews & payments ----------
r1, r2, r3 = st.columns(3)
with r1:
    dist = rw["review_score"].value_counts().sort_index().reset_index()
    dist.columns = ["score", "count"]
    dist["score"] = dist["score"].astype(str) + "★"
    fig = px.bar(dist, x="score", y="count", color="score", title="Distribusi skor review",
                 color_discrete_sequence=["#f472b6", "#f472b6", "#fbbf24", "#34d399", "#34d399"],
                 labels={"score": "", "count": ""})
    fig.update_layout(showlegend=False)
    st.plotly_chart(style(fig, 300), use_container_width=True)
with r2:
    fig = px.pie(ptype.reset_index(), names="payment_type", values="count", hole=0.55,
                 color_discrete_sequence=PALETTE, title="Metode pembayaran")
    st.plotly_chart(style(fig, 300), use_container_width=True)
with r3:
    g = rev.groupby("category")["review_score"].agg(["mean", "count"])
    g = g[g["count"] >= min_reviews].sort_values("mean").head(5).reset_index()
    fig = px.bar(g, x="mean", y="category", orientation="h", text=g["count"].map(lambda c: f"n={c}"),
                 title="Kategori rating terendah (all time)", color_discrete_sequence=["#f472b6"],
                 labels={"mean": "Rata-rata skor", "category": ""}, range_x=[0, 5])
    fig.update_yaxes(autorange="reversed")
    st.plotly_chart(style(fig, 300), use_container_width=True)
    st.caption("Kategori dengan review sedikit (mis. security_and_services, n=2) kurang andal.")

with st.expander("Lihat data revenue per kategori"):
    st.dataframe(cat.rename("revenue_brl").reset_index(), use_container_width=True, hide_index=True)
