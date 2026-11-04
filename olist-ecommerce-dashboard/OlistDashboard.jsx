import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { LayoutDashboard, ShoppingBag, CreditCard, Star, MapPin, Package, Search, Bell, Receipt, Percent, Repeat, ThumbsUp, ThumbsDown, TrendingUp, Users, Settings } from "lucide-react";

// Aggregated from the Olist CSVs (order_items, products, translation, sellers, payments, reviews).
// Time axis = month of order_items.shipping_limit_date (no orders table was provided). Window: 2017-01 to 2018-08.
const D = {"M":["2017-01","2017-02","2017-03","2017-04","2017-05","2017-06","2017-07","2017-08","2017-09","2017-10","2017-11","2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06","2018-07","2018-08"],"CAT":{"agro_industry_and_commerce":[44,247,82,0,1520,60,2570,0,2082,951,9544,11425,5605,5171,7725,5119,3627,3072,6678,7008],"air_conditioning":[475,3096,4172,2503,1116,1112,2242,3280,2031,3481,2227,2519,3805,1812,3739,3124,2802,3537,1810,4436],"art":[0,0,114,110,420,7089,387,200,394,349,0,190,1809,1802,671,1359,3190,2196,2183,1641],"arts_and_craftmanship":[0,0,0,0,22,0,130,0,0,0,0,0,0,0,0,16,90,0,517,1039],"audio":[0,100,1035,807,1971,1647,1175,1081,804,1988,3415,2274,3864,3337,7934,9205,3212,1866,1705,3112],"auto":[4128,12425,12503,15223,16814,34646,14760,20500,10137,25250,25653,44724,34409,39755,47068,48909,45476,39863,43807,54708],"baby":[2760,6356,3442,2942,7582,10413,13449,20455,22816,18011,19387,24574,25786,18887,43764,49243,38604,32670,20276,28691],"bed_bath_table":[2181,13806,23494,21122,32252,36043,60824,58695,53396,45122,79137,63130,67515,64203,68585,71972,75190,73867,53939,69438],"books_general_interest":[125,835,2433,1055,1628,2184,1245,2806,1416,683,2017,2444,2738,1589,2064,4995,7399,3289,4028,1696],"books_imported":[0,99,0,20,0,99,0,61,290,0,324,231,381,450,336,299,430,348,498,774],"books_technical":[0,159,75,75,262,146,0,1030,1587,451,1135,568,884,1588,1269,779,3274,1817,2072,1658],"cds_dvds_musicals":[0,0,0,0,0,0,180,180,0,0,240,65,0,0,0,0,65,0,0,0],"christmas_supplies":[0,0,0,0,69,0,250,59,255,262,1180,659,703,2210,883,276,615,271,490,619],"cine_photo":[0,59,0,59,118,79,0,0,69,69,242,0,200,228,623,452,2353,467,1111,804],"computers":[0,5749,0,0,0,0,0,0,81779,32552,22410,12548,10853,790,0,13775,8700,13297,3120,16860],"computers_accessories":[3219,11783,22450,22877,41972,37730,38831,36269,29807,37179,58906,57586,67593,86170,106164,65568,55047,37934,42633,50708],"consoles_games":[5191,3975,9759,5669,1463,5933,3348,9692,7108,12199,9866,12036,7506,9087,12245,10370,7302,5970,7007,7858],"construction_tools_construction":[0,647,773,0,0,376,649,791,1618,2208,5278,6354,8712,10239,10121,12307,21550,21563,15508,25951],"construction_tools_lights":[0,0,0,0,0,0,0,720,458,250,800,1738,2423,1053,2606,4825,5763,4324,6230,9771],"construction_tools_safety":[0,379,380,0,0,0,0,9,745,1849,3489,1415,1409,6588,3394,4229,5798,4853,1627,4382],"cool_stuff":[6060,12904,20095,20074,32846,36996,38796,42316,36673,39201,59711,42023,38666,29635,37326,34898,37038,16225,28624,23483],"costruction_tools_garden":[0,580,0,191,2857,20,750,1081,401,355,1124,1549,3892,1339,2593,1083,1301,675,1613,4232],"costruction_tools_tools":[0,0,0,0,1533,0,0,0,917,1019,90,469,355,877,1374,1385,508,620,4990,1767],"diapers_and_hygiene":[0,0,0,0,0,0,0,0,0,0,0,76,0,125,263,104,162,321,74,308],"drinks":[0,0,464,200,0,140,174,220,295,470,847,1831,2117,1581,1731,4906,3015,1557,935,1946],"dvds_blu_ray":[0,45,1874,1435,60,137,753,130,40,155,60,180,25,50,50,75,458,374,93,9],"electronics":[546,1106,3395,1866,9383,2757,6736,3719,3658,3419,6818,11728,14593,13894,14753,9363,15656,12003,9430,13914],"fashio_female_clothing":[77,249,229,65,272,305,115,384,356,0,50,30,96,96,120,0,175,0,0,35],"fashion_bags_accessories":[1417,2425,3708,3798,6068,7787,5062,6550,10642,9079,11921,10925,8276,7849,12725,7356,13667,7610,6125,9315],"fashion_childrens_clothes":[0,0,0,0,110,110,0,50,0,130,0,0,0,0,80,0,0,90,0,0],"fashion_male_clothing":[127,532,642,392,684,570,520,1335,813,1329,776,752,447,103,388,0,325,408,151,480],"fashion_shoes":[35,107,850,1469,1220,2344,878,1962,1100,1215,1954,1364,782,931,1296,1467,1555,1715,410,882],"fashion_sport":[0,0,40,190,125,456,110,60,206,444,60,60,120,0,90,90,0,0,0,70],"fashion_underwear_beach":[86,448,220,273,284,4,120,1116,1677,313,688,1573,916,429,369,190,327,179,50,280],"fixed_telephony":[666,421,1321,3569,459,860,265,3384,143,17342,854,979,2554,4639,2960,1999,1965,2219,7856,4423],"flowers":[0,0,0,0,0,0,0,0,0,0,188,83,285,134,30,166,69,108,48,0],"food":[0,739,2190,988,388,150,490,458,765,956,473,877,877,1454,2123,1267,2047,1353,2761,8956],"food_drink":[0,0,111,14,337,171,148,383,391,2115,1837,1840,442,788,2479,516,1212,473,625,1298],"furniture_bedroom":[73,450,0,210,2781,457,608,1078,779,1104,873,250,1100,677,1490,1302,988,1630,884,3296],"furniture_decor":[10168,19056,25331,16947,24776,19113,22734,34723,33374,28600,45420,50498,53013,37379,53671,53822,59090,39643,44019,52388],"furniture_living_room":[408,3254,4150,2619,3442,3201,3797,2817,1026,1963,3184,5425,1445,2567,5933,3136,3865,3808,5852,7026],"furniture_mattress_and_upholstery":[0,0,0,0,219,486,109,109,486,0,85,1053,786,225,679,0,0,0,130,0],"garden_tools":[6764,12376,20364,18340,26969,15268,19599,22973,23001,23367,43282,31966,23230,27168,28780,29556,46863,18226,22989,22699],"health_beauty":[8571,25071,23876,15999,42790,38960,31403,52650,48743,43572,64343,76916,63368,78435,105442,81134,98010,113700,98054,140284],"home_appliances":[0,741,313,237,1811,2276,3214,4463,2693,2126,3039,2557,1988,3013,8945,18091,6133,5766,4580,8186],"home_appliances_2":[467,1676,501,800,3093,754,1176,2995,2394,3007,4611,2592,4841,11795,4209,19413,16622,5280,15743,11350],"home_comfort_2":[73,0,13,343,0,13,13,13,39,26,77,0,0,0,74,13,0,26,39,0],"home_confort":[0,325,1086,3482,4196,3890,4510,3435,4845,3987,3718,4214,2770,2280,2842,2425,2650,2341,2903,2672],"home_construction":[0,561,727,885,2310,1911,109,218,1027,4236,3295,7859,5499,4777,5374,9419,9106,10458,6563,8753],"housewares":[2211,12829,11808,9173,23669,24037,20851,23091,21477,17607,27346,31644,33690,35206,40132,38751,65797,56532,52271,82269],"industry_commerce_and_business":[0,0,357,0,520,277,246,867,200,2287,2025,1563,2731,5125,2868,4507,5674,2473,4832,2760],"kitchen_dining_laundry_garden_furniture":[0,220,144,965,908,563,1076,1505,483,1087,6243,4915,3650,5715,1987,4025,2679,3162,3834,3023],"la_cuisine":[0,0,0,24,0,193,341,303,139,137,0,137,112,0,0,669,0,0,0,0],"luggage_accessories":[143,1909,4884,6153,11302,10020,8146,7555,4517,5421,8624,5767,17154,8449,6831,7682,7613,5415,3914,8934],"market_place":[397,1283,2218,2634,3342,1352,1797,2107,1107,820,1565,763,539,2136,1547,686,967,424,333,1053],"music":[20,0,28,35,25,329,1067,0,0,55,0,0,25,25,245,460,2212,158,853,498],"musical_instruments":[340,1983,1561,3065,9633,5873,5396,8336,8064,7734,15662,13258,12235,10004,10027,19364,21581,15406,8650,13328],"office_furniture":[0,12058,9791,8190,11163,5256,14375,13990,8091,13668,21769,8706,9265,22865,27850,21369,23478,14488,9681,16260],"party_supplies":[0,0,0,0,0,0,0,70,270,138,299,1086,68,68,683,275,40,146,58,1285],"pc_gamer":[0,0,0,260,130,130,0,0,0,0,0,0,0,130,0,0,0,0,0,896],"perfumery":[3094,8660,18277,18630,20257,25266,11776,15220,13359,16083,25167,34234,20288,20054,23048,15934,26368,26290,19829,31454],"pet_shop":[799,3245,8338,4494,9605,5229,6302,9337,9886,8713,8339,9447,10680,8458,12481,18686,14284,17766,15437,31713],"portateis_cozinha_e_preparadores_de_alimentos":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1958,0,94,1917],"security_and_services":[183,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0],"signaling_and_security":[0,0,0,174,110,702,520,388,322,860,559,138,1619,642,1027,938,2037,5321,3742,2410],"small_appliances":[513,5035,11356,16350,12755,6792,9026,4132,5442,11655,6952,10798,10891,7274,15949,10761,11577,15804,9553,8034],"small_appliances_home_oven_and_coffee":[0,0,0,0,0,0,72,22,728,0,0,0,370,2275,5364,13010,13831,4078,3711,3985],"sports_leisure":[7678,15744,26645,19735,37082,34037,34252,45262,47759,51478,57334,67559,65990,88688,92246,65964,66454,45564,50011,64808],"stationery":[892,2942,4640,4647,6011,4061,6150,7511,5042,7611,15995,24290,42662,12036,13869,12351,12614,13596,13312,20351],"tablets_printing_image":[0,495,594,663,2064,693,198,342,244,198,350,419,110,589,417,0,102,50,0,0],"telephony":[1714,7464,6031,7046,9594,8979,6590,11595,18416,20201,24154,18921,13313,15357,17182,23289,20282,26464,17803,47252],"toys":[3856,9007,11359,10444,21287,20148,19801,20967,27555,37630,48968,70548,26119,12303,23483,21685,33251,22083,17459,21070],"unknown":[1501,8178,5897,7375,12210,6974,3079,4580,6329,16668,14663,13391,24715,13203,16392,10112,4416,2667,3213,3906],"watches_gifts":[3123,12149,27103,21246,37766,31401,31995,38461,44243,65587,92713,77189,70378,61428,99521,78218,133848,94835,91764,85738]},"ST":{"MG":[70,230,334,253,474,406,343,476,432,463,585,583,550,484,544,463,534,516,477,574],"Other":[32,112,168,136,207,181,175,219,324,315,360,359,357,302,365,349,471,362,472,626],"PR":[107,177,216,174,263,255,250,305,255,355,507,595,620,863,845,625,554,447,550,654],"RJ":[41,89,96,110,112,119,103,107,154,197,329,395,324,320,354,315,427,381,335,462],"SC":[33,101,136,121,216,157,187,236,188,165,232,269,235,226,297,198,254,253,234,318],"SP":[398,1157,1801,1570,2878,2683,3058,3699,3371,3694,5342,5525,5406,5180,6354,5687,6525,4938,4604,6181]},"PAY":{"boleto":[137,386,493,417,790,701,812,913,866,953,1191,1484,1376,1212,1498,1257,1433,1019,1130,1474],"credit_card":[422,1235,1837,1640,2803,2613,2733,3390,3199,3431,4994,5157,5066,5078,5965,5197,6013,4756,4514,5932],"debit_card":[7,13,28,24,34,26,25,30,40,53,59,67,104,74,75,98,53,168,206,332],"voucher":[38,110,198,176,280,266,309,306,279,273,353,325,397,323,370,367,352,303,273,315]},"INS":[[1716.0,4823.0,7338.0,6783.0,12473.0,11477.0,11999.0,14365.0,13174.0,13533.0,19849.0,20477.0,18307.0,17681.0,22014.0,18558.0,21816.0,17944.0,16623.0,21905.0],[604.0,1744.0,2556.0,2257.0,3907.0,3606.0,3879.0,4639.0,4384.0,4710.0,6597.0,7033.0,6943.0,6687.0,7908.0,6919.0,7851.0,6246.0,6123.0,8053.0]],"REV":{"1":[68,168,257,246,341,320,289,360,367,420,810,915,756,919,1559,737,679,474,480,642],"2":[19,52,67,82,121,92,123,134,124,120,211,244,221,228,310,222,199,167,145,200],"3":[47,150,223,188,335,290,324,324,303,357,577,591,591,601,724,498,611,421,399,545],"4":[97,309,489,416,752,696,713,850,848,929,1228,1365,1221,1269,1398,1334,1456,1121,1042,1513],"5":[341,966,1359,1173,2122,1999,2189,2752,2516,2664,3473,3634,3839,3443,3646,3823,4589,3813,3824,4882]},"REVN":[80125,245982,343243,308148,505655,469001,465282,560093,617046,658020,883352,898921,845279,819229,1030528,958730,1084359,870737,811132,1072148],"ORD":[573,1650,2401,2111,3674,3385,3643,4403,4165,4490,6314,6772,6656,6450,7636,6656,7572,6019,5922,7823],"WORST":[["security_and_services",2.5,2],["portateis_cozinha_e_preparadores_de_alimentos",3.43,14],["pc_gamer",3.43,7],["office_furniture",3.63,1254],["diapers_and_hygiene",3.69,26]]};

const RANGES = [{ k: "3M", n: 3 }, { k: "6M", n: 6 }, { k: "12M", n: 12 }, { k: "All", n: 99 }];
const COLORS = ["#38bdf8", "#34d399", "#fbbf24", "#f472b6", "#a78bfa", "#64748b"];
const brl = (v) => "R$ " + Math.round(v).toLocaleString("id-ID");
const sum = (a, s) => a.slice(s).reduce((x, y) => x + y, 0);
const nice = (s) => s.replace(/_/g, " ");

function Glass({ className = "", children }) {
  return <div className={"rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,.35)] " + className}>{children}</div>;
}

function Stat({ icon: Icon, label, value, sub, tone = "text-sky-300" }) {
  return (
    <Glass className="p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(56,189,248,.25)]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Icon size={18} className={tone} /></div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
      <div className="mt-0.5 text-xs text-white/40">{sub}</div>
    </Glass>
  );
}

export default function OlistDashboard() {
  const [range, setRange] = useState("6M");
  const [mode, setMode] = useState("top");
  const [nav, setNav] = useState("Overview");
  const n = RANGES.find((r) => r.k === range).n;
  const s = Math.max(0, D.M.length - n);
  const label = range === "All" ? "Jan 2017 – Aug 2018" : `${D.M[s]} → ${D.M[D.M.length - 1]}`;

  const v = useMemo(() => {
    const cats = Object.entries(D.CAT).map(([c, a]) => ({ name: nice(c), value: sum(a, s) })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
    const bars = mode === "top" ? cats.slice(0, 5) : cats.slice(-5).reverse();
    const revenue = sum(D.REVN, s), orders = sum(D.ORD, s);
    const states = Object.entries(D.ST).map(([k, a]) => ({ name: k, value: sum(a, s) }));
    const items = states.reduce((x, y) => x + y.value, 0);
    const sp = states.find((x) => x.name === "SP").value;
    const pay = Object.entries(D.PAY).map(([k, a]) => ({ name: k, value: sum(a, s) })).sort((a, b) => b.value - a.value);
    const payTot = pay.reduce((x, y) => x + y.value, 0);
    const inst = sum(D.INS[0], s) / sum(D.INS[1], s);
    const rv = [1, 2, 3, 4, 5].map((k) => ({ star: k + "★", value: sum(D.REV[k], s) }));
    const rvTot = rv.reduce((x, y) => x + y.value, 0);
    const avg = rv.reduce((x, y, i) => x + y.value * (i + 1), 0) / rvTot;
    return { bars, revenue, orders, states, items, sp, pay, payTot, inst, rv, rvTot, avg, top: cats[0] };
  }, [s, mode]);
  const pct = (a, b) => ((a / b) * 100).toFixed(1) + "%";
  const get = (k) => v.pay.find((x) => x.name === k)?.value || 0;
  const navItems = [["Overview", LayoutDashboard], ["Products", Package], ["Payments", CreditCard], ["Sellers", MapPin], ["Reviews", Star], ["Customers", Users], ["Settings", Settings]];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0b2538] to-[#0e4a5e] text-white lg:flex">
      <aside className="border-b border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl lg:min-h-screen lg:w-60 lg:border-b-0 lg:border-r">
        <div className="mb-4 flex items-center gap-2 px-2 font-semibold"><ShoppingBag className="text-sky-400" size={20} />Olist Admin</div>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {navItems.map(([name, Icon]) => (
            <button key={name} onClick={() => setNav(name)} className={"flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition " + (nav === name ? "bg-sky-500/30 text-white shadow-[0_0_20px_rgba(56,189,248,.3)]" : "text-white/60 hover:bg-white/10 hover:text-white")}>
              <Icon size={16} />{name}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 lg:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50"><Search size={15} />Search categories, states, payments…</div>
          <Bell size={18} className="text-white/60" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold">AD</div>
        </div>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">E-commerce Overview</h1>
            <p className="text-xs text-white/50">Olist marketplace · {label}</p>
          </div>
          <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <button key={r.k} onClick={() => setRange(r.k)} className={"rounded-full px-4 py-1.5 text-xs font-medium transition " + (range === r.k ? "bg-white text-slate-900" : "text-white/70 hover:bg-white/10")}>{r.k === "All" ? "All time" : r.k.replace("M", " months")}</button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid gap-4 xl:grid-cols-3">
          <Glass className="p-5 xl:col-span-2">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">{mode === "top" ? "Top 5" : "Bottom 5"} categories by revenue</h2>
                <p className="text-xs text-white/50">{brl(v.revenue)} total · leader: {v.top.name}</p>
              </div>
              <div className="flex gap-1 rounded-full bg-white/5 p-1 text-xs">
                {["top", "bottom"].map((m) => <button key={m} onClick={() => setMode(m)} className={"rounded-full px-3 py-1 capitalize " + (mode === m ? "bg-sky-500" : "text-white/60 hover:bg-white/10")}>{m}</button>)}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={v.bars} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 10 }} interval={0} tickFormatter={(t) => (t.length > 12 ? t.slice(0, 11) + "…" : t)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(t) => (t >= 1000 ? Math.round(t / 1000) + "K" : t)} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(255,255,255,.06)" }} formatter={(x) => brl(x)} contentStyle={{ background: "#0f2a3d", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="value" fill={mode === "top" ? "#38bdf8" : "#f472b6"} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Glass>

          <Glass className="p-5">
            <h2 className="text-sm font-semibold">Seller states</h2>
            <p className="text-xs text-white/50">Share of items sold</p>
            <div className="relative h-44">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={v.states} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="none">
                    {v.states.map((_, i) => <Cell key={i} fill={COLORS[i % 6]} />)}
                  </Pie>
                  <Tooltip formatter={(x) => x.toLocaleString("id-ID") + " items"} contentStyle={{ background: "#0f2a3d", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><b className="text-lg">{pct(v.sp, v.items)}</b><span className="text-[10px] text-white/50">SP</span></div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              {v.states.map((x, i) => <div key={x.name} className="flex justify-between"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: COLORS[i % 6] }} />{x.name}</span><span className="text-white/60">{x.value.toLocaleString("id-ID")}</span></div>)}
            </div>
          </Glass>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <Stat icon={TrendingUp} label="Total revenue" value={brl(v.revenue)} sub={`Top: ${v.top.name} ${brl(v.top.value)}`} />
          <Stat icon={Receipt} label="Total transactions" value={v.items.toLocaleString("id-ID")} sub={`SP: ${v.sp.toLocaleString("id-ID")} (${pct(v.sp, v.items)})`} tone="text-emerald-300" />
          <Stat icon={CreditCard} label="Credit card payments" value={get("credit_card").toLocaleString("id-ID")} sub={`${pct(get("credit_card"), v.payTot)} of payments`} tone="text-amber-300" />
          <Stat icon={Star} label="Avg review score" value={v.avg.toFixed(2) + " / 5"} sub={`${pct(v.rv[4].value, v.rvTot)} give 5★`} tone="text-pink-300" />
          <Stat icon={Package} label="Orders" value={v.orders.toLocaleString("id-ID")} sub={`AOV ${brl(v.revenue / v.orders)}`} />
          <Stat icon={Percent} label="Boleto payments" value={get("boleto").toLocaleString("id-ID")} sub={`${pct(get("boleto"), v.payTot)} of payments`} tone="text-emerald-300" />
          <Stat icon={Repeat} label="Avg installments" value={v.inst.toFixed(2)} sub="per payment record" tone="text-amber-300" />
          <Stat icon={ThumbsDown} label="1★ reviews" value={pct(v.rv[0].value, v.rvTot)} sub={`${v.rv[0].value.toLocaleString("id-ID")} reviews`} tone="text-pink-300" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Glass className="p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold"><ThumbsUp size={15} className="text-sky-300" />Review score distribution</h2>
            <div className="h-40">
              <ResponsiveContainer>
                <BarChart data={v.rv}>
                  <XAxis dataKey="star" tick={{ fill: "#cbd5e1", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(255,255,255,.06)" }} contentStyle={{ background: "#0f2a3d", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>{v.rv.map((_, i) => <Cell key={i} fill={i < 2 ? "#f472b6" : i === 2 ? "#fbbf24" : "#34d399"} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Glass>
          <Glass className="p-5">
            <h2 className="text-sm font-semibold">Lowest-rated categories (all time)</h2>
            <p className="mb-3 text-xs text-white/50">Needs attention · categories with fewer than 30 reviews are low confidence</p>
            {D.WORST.map(([c, sc, cnt]) => (
              <div key={c} className="mb-2.5">
                <div className="flex justify-between text-xs"><span>{nice(c)}</span><span className="text-white/60">{sc.toFixed(2)} ★ · n={cnt}</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-pink-400" style={{ width: (sc / 5) * 100 + "%" }} /></div>
              </div>
            ))}
          </Glass>
        </div>
      </main>
    </div>
  );
}
