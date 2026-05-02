export interface Port {
  code: string    // UN/LOCODE e.g. CNNGB
  name: string    // Port name
  city: string    // City
  cc: string      // Country code e.g. CN
  country: string // Country name
}

export const PORTS: Port[] = [

  // ── China (CN) ────────────────────────────────────────────────────────
  { code: 'CNSHG', name: 'Shanghai', city: 'Shanghai', cc: 'CN', country: 'China' },
  { code: 'CNSHA', name: 'Shanghai (Yangshan)', city: 'Shanghai', cc: 'CN', country: 'China' },
  { code: 'CNNBG', name: 'Ningbo', city: 'Ningbo', cc: 'CN', country: 'China' },
  { code: 'CNQDG', name: 'Qingdao', city: 'Qingdao', cc: 'CN', country: 'China' },
  { code: 'CNTXG', name: 'Tianjin (Xingang)', city: 'Tianjin', cc: 'CN', country: 'China' },
  { code: 'CNGZG', name: 'Guangzhou', city: 'Guangzhou', cc: 'CN', country: 'China' },
  { code: 'CNXMG', name: 'Xiamen', city: 'Xiamen', cc: 'CN', country: 'China' },
  { code: 'CNDAL', name: 'Dalian', city: 'Dalian', cc: 'CN', country: 'China' },
  { code: 'CNNJG', name: 'Nanjing', city: 'Nanjing', cc: 'CN', country: 'China' },
  { code: 'CNNHN', name: 'Wuhan', city: 'Wuhan', cc: 'CN', country: 'China' },
  { code: 'CNZOS', name: 'Zhoushan', city: 'Zhoushan', cc: 'CN', country: 'China' },
  { code: 'CNFZG', name: 'Fuzhou', city: 'Fuzhou', cc: 'CN', country: 'China' },
  { code: 'CNYTN', name: 'Yantian (Shenzhen)', city: 'Shenzhen', cc: 'CN', country: 'China' },
  { code: 'CNSHK', name: 'Shekou (Shenzhen)', city: 'Shenzhen', cc: 'CN', country: 'China' },
  { code: 'CNDCB', name: 'Da Chan Bay', city: 'Shenzhen', cc: 'CN', country: 'China' },
  { code: 'CNNSA', name: 'Nansha (Guangzhou)', city: 'Guangzhou', cc: 'CN', country: 'China' },
  { code: 'CNHUA', name: 'Huangpu (Guangzhou)', city: 'Guangzhou', cc: 'CN', country: 'China' },
  { code: 'CNLYG', name: 'Lianyungang', city: 'Lianyungang', cc: 'CN', country: 'China' },
  { code: 'CNYIK', name: 'Yingkou', city: 'Yingkou', cc: 'CN', country: 'China' },
  { code: 'CNYTG', name: 'Yantai', city: 'Yantai', cc: 'CN', country: 'China' },
  { code: 'CNNTG', name: 'Nantong', city: 'Nantong', cc: 'CN', country: 'China' },
  { code: 'CNTAC', name: 'Taicang', city: 'Taicang', cc: 'CN', country: 'China' },
  { code: 'CNZJG', name: 'Zhangjiagang', city: 'Zhangjiagang', cc: 'CN', country: 'China' },
  { code: 'CNJIA', name: 'Jiangyin', city: 'Jiangyin', cc: 'CN', country: 'China' },
  { code: 'CNSTG', name: 'Shantou', city: 'Shantou', cc: 'CN', country: 'China' },
  { code: 'CNHAZ', name: 'Hangzhou', city: 'Hangzhou', cc: 'CN', country: 'China' },
  { code: 'CNWNZ', name: 'Wenzhou', city: 'Wenzhou', cc: 'CN', country: 'China' },
  { code: 'CNQZL', name: 'Quanzhou', city: 'Quanzhou', cc: 'CN', country: 'China' },
  { code: 'CNZHA', name: 'Zhanjiang', city: 'Zhanjiang', cc: 'CN', country: 'China' },
  { code: 'CNRZH', name: 'Rizhao', city: 'Rizhao', cc: 'CN', country: 'China' },
  { code: 'CNSHP', name: 'Qinhuangdao', city: 'Qinhuangdao', cc: 'CN', country: 'China' },
  { code: 'CNHIG', name: 'Haikou', city: 'Haikou', cc: 'CN', country: 'China' },
  { code: 'CNSYA', name: 'Sanya', city: 'Sanya', cc: 'CN', country: 'China' },
  { code: 'CNQZH', name: 'Qinzhou', city: 'Qinzhou', cc: 'CN', country: 'China' },
  { code: 'CNFAN', name: 'Fang Cheng', city: 'Fang Cheng', cc: 'CN', country: 'China' },
  { code: 'CNBHY', name: 'Beihai', city: 'Beihai', cc: 'CN', country: 'China' },
  { code: 'CNCQI', name: 'Chongqing', city: 'Chongqing', cc: 'CN', country: 'China' },
  { code: 'CNCDU', name: 'Chengdu', city: 'Chengdu', cc: 'CN', country: 'China' },
  { code: 'CNXIA', name: "Xi'an", city: "Xi'an", cc: 'CN', country: 'China' },
  { code: 'CNSZH', name: 'Suzhou', city: 'Suzhou', cc: 'CN', country: 'China' },
  { code: 'CNDGG', name: 'Dongguan', city: 'Dongguan', cc: 'CN', country: 'China' },
  { code: 'CNFOS', name: 'Foshan', city: 'Foshan', cc: 'CN', country: 'China' },
  { code: 'CNHFI', name: 'Hefei', city: 'Hefei', cc: 'CN', country: 'China' },
  { code: 'CNNCH', name: 'Nanchang', city: 'Nanchang', cc: 'CN', country: 'China' },
  { code: 'CNJIU', name: 'Jiujiang', city: 'Jiujiang', cc: 'CN', country: 'China' },
  { code: 'CNWHI', name: 'Wuhu', city: 'Wuhu', cc: 'CN', country: 'China' },
  { code: 'CNNNG', name: 'Nanning', city: 'Nanning', cc: 'CN', country: 'China' },
  { code: 'CNDDG', name: 'Dandong', city: 'Dandong', cc: 'CN', country: 'China' },
  { code: 'CNJNZ', name: 'Jinzhou', city: 'Jinzhou', cc: 'CN', country: 'China' },
  { code: 'CNPAJ', name: 'Panjin', city: 'Panjin', cc: 'CN', country: 'China' },
  { code: 'CNBYQ', name: 'Bayuquan', city: 'Bayuquan', cc: 'CN', country: 'China' },
  { code: 'CNWEF', name: 'Weifang', city: 'Weifang', cc: 'CN', country: 'China' },
  { code: 'CNWEI', name: 'Weihai', city: 'Weihai', cc: 'CN', country: 'China' },
  { code: 'CNLKU', name: 'Longkou', city: 'Longkou', cc: 'CN', country: 'China' },
  { code: 'CNTZO', name: 'Taizhou', city: 'Taizhou', cc: 'CN', country: 'China' },
  { code: 'CNCZX', name: 'Changzhou', city: 'Changzhou', cc: 'CN', country: 'China' },
  { code: 'CNYZH', name: 'Yangzhou', city: 'Yangzhou', cc: 'CN', country: 'China' },
  { code: 'CNZHE', name: 'Zhenjiang', city: 'Zhenjiang', cc: 'CN', country: 'China' },
  { code: 'CNYSA', name: 'Yangshan', city: 'Yangshan', cc: 'CN', country: 'China' },
  { code: 'CNGUG', name: 'Guigang', city: 'Guigang', cc: 'CN', country: 'China' },
  { code: 'CNWUZ', name: 'Wuzhou', city: 'Wuzhou', cc: 'CN', country: 'China' },
  { code: 'CNHUD', name: 'Huludao', city: 'Huludao', cc: 'CN', country: 'China' },
  { code: 'CNCSH', name: 'Changsha', city: 'Changsha', cc: 'CN', country: 'China' },
  { code: 'CNCFD', name: 'Caofeidian (Tangshan)', city: 'Tangshan', cc: 'CN', country: 'China' },
  { code: 'CNTGS', name: 'Jingtang (Tangshan)', city: 'Tangshan', cc: 'CN', country: 'China' },
  { code: 'CNCGS', name: 'Changshu', city: 'Changshu', cc: 'CN', country: 'China' },
  { code: 'CNMAA', name: 'Maanshan', city: 'Maanshan', cc: 'CN', country: 'China' },
  { code: 'CNPUT', name: 'Putian', city: 'Putian', cc: 'CN', country: 'China' },
  { code: 'CNNDE', name: 'Ningde', city: 'Ningde', cc: 'CN', country: 'China' },
  { code: 'CNYYA', name: 'Yueyang', city: 'Yueyang', cc: 'CN', country: 'China' },
  { code: 'CNZSN', name: 'Zhongshan', city: 'Zhongshan', cc: 'CN', country: 'China' },
  { code: 'CNJMN', name: 'Jiangmen', city: 'Jiangmen', cc: 'CN', country: 'China' },
  { code: 'CNHUА', name: 'Huizhou', city: 'Huizhou', cc: 'CN', country: 'China' },
  { code: 'CNGON', name: 'Gaolan (Zhuhai)', city: 'Zhuhai', cc: 'CN', country: 'China' },

  // ── India (IN) ────────────────────────────────────────────────────────
  { code: 'INNSA', name: 'Nhava Sheva (JNPT)', city: 'Mumbai', cc: 'IN', country: 'India' },
  { code: 'INMUN', name: 'Mundra', city: 'Mundra', cc: 'IN', country: 'India' },
  { code: 'INMAA', name: 'Chennai (Madras)', city: 'Chennai', cc: 'IN', country: 'India' },
  { code: 'INCCU', name: 'Kolkata (Calcutta)', city: 'Kolkata', cc: 'IN', country: 'India' },
  { code: 'INCOK', name: 'Cochin (Kochi)', city: 'Kochi', cc: 'IN', country: 'India' },
  { code: 'INVTZ', name: 'Visakhapatnam', city: 'Visakhapatnam', cc: 'IN', country: 'India' },
  { code: 'INHAL', name: 'Haldia', city: 'Haldia', cc: 'IN', country: 'India' },
  { code: 'INPPV', name: 'Pipavav', city: 'Pipavav', cc: 'IN', country: 'India' },
  { code: 'INTUT', name: 'Tuticorin', city: 'Tuticorin', cc: 'IN', country: 'India' },
  { code: 'INIXY', name: 'Kandla', city: 'Kandla', cc: 'IN', country: 'India' },
  { code: 'INPRT', name: 'Paradip', city: 'Paradip', cc: 'IN', country: 'India' },
  { code: 'INHZR', name: 'Hazira', city: 'Surat', cc: 'IN', country: 'India' },
  { code: 'INMRM', name: 'Marmugao (Goa)', city: 'Goa', cc: 'IN', country: 'India' },
  { code: 'INIXE', name: 'Mangalore', city: 'Mangalore', cc: 'IN', country: 'India' },
  { code: 'INKAT', name: 'Kattupalli', city: 'Chennai', cc: 'IN', country: 'India' },
  { code: 'INKAK', name: 'Kakinada', city: 'Kakinada', cc: 'IN', country: 'India' },
  { code: 'INKRI', name: 'Krishnapatnam', city: 'Krishnapatnam', cc: 'IN', country: 'India' },
  { code: 'INGGV', name: 'Gangavaram', city: 'Gangavaram', cc: 'IN', country: 'India' },
  { code: 'INJGD', name: 'Jaigad', city: 'Jaigad', cc: 'IN', country: 'India' },
  { code: 'INBOM', name: 'Mumbai', city: 'Mumbai', cc: 'IN', country: 'India' },
  { code: 'INTRV', name: 'Thiruvananthapuram', city: 'Thiruvananthapuram', cc: 'IN', country: 'India' },
  { code: 'INVZJ', name: 'Vizhinjam', city: 'Vizhinjam', cc: 'IN', country: 'India' },
  { code: 'INBLR', name: 'Bangalore (ICD)', city: 'Bengaluru', cc: 'IN', country: 'India' },
  { code: 'INDEL', name: 'Delhi (ICD)', city: 'New Delhi', cc: 'IN', country: 'India' },
  { code: 'INDRI', name: 'Dadri (ICD)', city: 'Dadri', cc: 'IN', country: 'India' },
  { code: 'INTKD', name: 'Tughlakabad (ICD)', city: 'New Delhi', cc: 'IN', country: 'India' },
  { code: 'INLUH', name: 'Ludhiana (ICD)', city: 'Ludhiana', cc: 'IN', country: 'India' },
  { code: 'INAMD', name: 'Ahmedabad (ICD)', city: 'Ahmedabad', cc: 'IN', country: 'India' },
  { code: 'INHYD', name: 'Hyderabad (ICD)', city: 'Hyderabad', cc: 'IN', country: 'India' },
  { code: 'INPNI', name: 'Panipat (ICD)', city: 'Panipat', cc: 'IN', country: 'India' },
  { code: 'INJAI', name: 'Jaipur (ICD)', city: 'Jaipur', cc: 'IN', country: 'India' },
  { code: 'INBDQ', name: 'Vadodara (ICD)', city: 'Vadodara', cc: 'IN', country: 'India' },
  { code: 'INPIT', name: 'Pithampur (ICD)', city: 'Pithampur', cc: 'IN', country: 'India' },
  { code: 'INMOB', name: 'Morbi (ICD)', city: 'Morbi', cc: 'IN', country: 'India' },
  { code: 'INPPG', name: 'Patparganj (ICD)', city: 'Delhi', cc: 'IN', country: 'India' },
  { code: 'INREA', name: 'Rewari (ICD)', city: 'Rewari', cc: 'IN', country: 'India' },
  { code: 'INGHR', name: 'Garhi Harsaru (ICD)', city: 'Gurgaon', cc: 'IN', country: 'India' },
  { code: 'INBSR', name: 'Boisar (ICD)', city: 'Boisar', cc: 'IN', country: 'India' },

  // ── Singapore (SG) ────────────────────────────────────────────────────
  { code: 'SGSIN', name: 'Singapore', city: 'Singapore', cc: 'SG', country: 'Singapore' },

  // ── Malaysia (MY) ─────────────────────────────────────────────────────
  { code: 'MYPKG', name: 'Port Klang', city: 'Klang', cc: 'MY', country: 'Malaysia' },
  { code: 'MYTPP', name: 'Tanjung Pelepas', city: 'Johor', cc: 'MY', country: 'Malaysia' },
  { code: 'MYBTU', name: 'Bintulu', city: 'Bintulu', cc: 'MY', country: 'Malaysia' },
  { code: 'MYPEN', name: 'Penang', city: 'Penang', cc: 'MY', country: 'Malaysia' },
  { code: 'MYPGU', name: 'Johor (Pasir Gudang)', city: 'Johor', cc: 'MY', country: 'Malaysia' },
  { code: 'MYKCH', name: 'Kuching', city: 'Kuching', cc: 'MY', country: 'Malaysia' },
  { code: 'MYBKI', name: 'Kota Kinabalu', city: 'Kota Kinabalu', cc: 'MY', country: 'Malaysia' },
  { code: 'MYKEM', name: 'Kemaman', city: 'Kemaman', cc: 'MY', country: 'Malaysia' },
  { code: 'MYKUA', name: 'Kuantan', city: 'Kuantan', cc: 'MY', country: 'Malaysia' },
  { code: 'MYLBU', name: 'Labuan', city: 'Labuan', cc: 'MY', country: 'Malaysia' },
  { code: 'MYMYY', name: 'Miri', city: 'Miri', cc: 'MY', country: 'Malaysia' },
  { code: 'MYSBW', name: 'Sibu', city: 'Sibu', cc: 'MY', country: 'Malaysia' },
  { code: 'MYTMP', name: 'Tanjung Manis', city: 'Tanjung Manis', cc: 'MY', country: 'Malaysia' },
  { code: 'MYTWU', name: 'Tawau', city: 'Tawau', cc: 'MY', country: 'Malaysia' },

  // ── Indonesia (ID) ────────────────────────────────────────────────────
  { code: 'IDJKT', name: 'Jakarta (Tanjung Priok)', city: 'Jakarta', cc: 'ID', country: 'Indonesia' },
  { code: 'IDSUB', name: 'Surabaya (Tanjung Perak)', city: 'Surabaya', cc: 'ID', country: 'Indonesia' },
  { code: 'IDBDJ', name: 'Banjarmasin', city: 'Banjarmasin', cc: 'ID', country: 'Indonesia' },
  { code: 'IDMAK', name: 'Makassar', city: 'Makassar', cc: 'ID', country: 'Indonesia' },
  { code: 'IDBLW', name: 'Belawan (Medan)', city: 'Medan', cc: 'ID', country: 'Indonesia' },
  { code: 'IDBPN', name: 'Balikpapan', city: 'Balikpapan', cc: 'ID', country: 'Indonesia' },
  { code: 'IDPDG', name: 'Padang (Telukbayur)', city: 'Padang', cc: 'ID', country: 'Indonesia' },
  { code: 'IDPLM', name: 'Palembang', city: 'Palembang', cc: 'ID', country: 'Indonesia' },
  { code: 'IDDUM', name: 'Dumai', city: 'Dumai', cc: 'ID', country: 'Indonesia' },
  { code: 'IDSRG', name: 'Semarang', city: 'Semarang', cc: 'ID', country: 'Indonesia' },
  { code: 'IDBTH', name: 'Batam', city: 'Batam', cc: 'ID', country: 'Indonesia' },
  { code: 'IDGRE', name: 'Gresik', city: 'Gresik', cc: 'ID', country: 'Indonesia' },
  { code: 'IDPNK', name: 'Pontianak', city: 'Pontianak', cc: 'ID', country: 'Indonesia' },
  { code: 'IDBOA', name: 'Benoa (Bali)', city: 'Bali', cc: 'ID', country: 'Indonesia' },
  { code: 'IDBIT', name: 'Bitung', city: 'Bitung', cc: 'ID', country: 'Indonesia' },
  { code: 'IDAMQ', name: 'Ambon', city: 'Ambon', cc: 'ID', country: 'Indonesia' },
  { code: 'IDPKU', name: 'Pekanbaru', city: 'Pekanbaru', cc: 'ID', country: 'Indonesia' },
  { code: 'IDKTJ', name: 'Kuala Tanjung', city: 'Kuala Tanjung', cc: 'ID', country: 'Indonesia' },
  { code: 'IDKOE', name: 'Kupang', city: 'Kupang', cc: 'ID', country: 'Indonesia' },
  { code: 'IDSRI', name: 'Samarinda', city: 'Samarinda', cc: 'ID', country: 'Indonesia' },
  { code: 'IDTRK', name: 'Tarakan', city: 'Tarakan', cc: 'ID', country: 'Indonesia' },
  { code: 'IDPNJ', name: 'Panjang', city: 'Panjang', cc: 'ID', country: 'Indonesia' },
  { code: 'IDDJJ', name: 'Jayapura', city: 'Jayapura', cc: 'ID', country: 'Indonesia' },
  { code: 'IDSOQ', name: 'Sorong', city: 'Sorong', cc: 'ID', country: 'Indonesia' },
  { code: 'IDKDI', name: 'Kendari', city: 'Kendari', cc: 'ID', country: 'Indonesia' },
  { code: 'IDUPG', name: 'Ujung Pandang', city: 'Makassar', cc: 'ID', country: 'Indonesia' },

  // ── Vietnam (VN) ─────────────────────────────────────────────────────
  { code: 'VNSGN', name: 'Ho Chi Minh City', city: 'Ho Chi Minh', cc: 'VN', country: 'Vietnam' },
  { code: 'VNHPH', name: 'Hai Phong', city: 'Hai Phong', cc: 'VN', country: 'Vietnam' },
  { code: 'VNDAD', name: 'Da Nang', city: 'Da Nang', cc: 'VN', country: 'Vietnam' },
  { code: 'VNVUT', name: 'Vung Tau', city: 'Vung Tau', cc: 'VN', country: 'Vietnam' },
  { code: 'VNCMT', name: 'Cai Mep', city: 'Cai Mep', cc: 'VN', country: 'Vietnam' },
  { code: 'VNCLN', name: 'Cai Lan', city: 'Cai Lan', cc: 'VN', country: 'Vietnam' },
  { code: 'VNUIH', name: 'Qui Nhon', city: 'Qui Nhon', cc: 'VN', country: 'Vietnam' },
  { code: 'VNTCG', name: 'Tan Cang', city: 'Ho Chi Minh', cc: 'VN', country: 'Vietnam' },
  { code: 'VNPHU', name: 'Phu My', city: 'Phu My', cc: 'VN', country: 'Vietnam' },
  { code: 'VNDNA', name: 'Dong Nai', city: 'Dong Nai', cc: 'VN', country: 'Vietnam' },
  { code: 'VNBDU', name: 'Binh Duong (ICD)', city: 'Binh Duong', cc: 'VN', country: 'Vietnam' },
  { code: 'VNNGH', name: 'Nghi Son', city: 'Nghi Son', cc: 'VN', country: 'Vietnam' },
  { code: 'VNC8Q', name: 'Chu Lai', city: 'Chu Lai', cc: 'VN', country: 'Vietnam' },

  // ── Thailand (TH) ────────────────────────────────────────────────────
  { code: 'THBKK', name: 'Bangkok', city: 'Bangkok', cc: 'TH', country: 'Thailand' },
  { code: 'THLCH', name: 'Laem Chabang', city: 'Chonburi', cc: 'TH', country: 'Thailand' },
  { code: 'THSGK', name: 'Songkhla', city: 'Songkhla', cc: 'TH', country: 'Thailand' },
  { code: 'THLKR', name: 'Lat Krabang (ICD)', city: 'Bangkok', cc: 'TH', country: 'Thailand' },
  { code: 'THSAP', name: 'Samut Prakarn', city: 'Samut Prakarn', cc: 'TH', country: 'Thailand' },
  { code: 'THSRI', name: 'Sriracha', city: 'Sriracha', cc: 'TH', country: 'Thailand' },
  { code: 'THHKT', name: 'Phuket', city: 'Phuket', cc: 'TH', country: 'Thailand' },

  // ── Philippines (PH) ─────────────────────────────────────────────────
  { code: 'PHMNL', name: 'Manila', city: 'Manila', cc: 'PH', country: 'Philippines' },
  { code: 'PHCEB', name: 'Cebu', city: 'Cebu', cc: 'PH', country: 'Philippines' },
  { code: 'PHDVO', name: 'Davao', city: 'Davao', cc: 'PH', country: 'Philippines' },
  { code: 'PHBTG', name: 'Batangas', city: 'Batangas', cc: 'PH', country: 'Philippines' },
  { code: 'PHSFS', name: 'Subic Bay', city: 'Subic Bay', cc: 'PH', country: 'Philippines' },
  { code: 'PHGES', name: 'General Santos', city: 'General Santos', cc: 'PH', country: 'Philippines' },
  { code: 'PHILO', name: 'Iloilo', city: 'Iloilo', cc: 'PH', country: 'Philippines' },
  { code: 'PHCGY', name: 'Cagayan de Oro', city: 'Cagayan de Oro', cc: 'PH', country: 'Philippines' },
  { code: 'PHZAM', name: 'Zamboanga', city: 'Zamboanga', cc: 'PH', country: 'Philippines' },

  // ── Bangladesh (BD) ───────────────────────────────────────────────────
  { code: 'BDCGP', name: 'Chittagong (Chattogram)', city: 'Chittagong', cc: 'BD', country: 'Bangladesh' },
  { code: 'BDMGL', name: 'Mongla', city: 'Mongla', cc: 'BD', country: 'Bangladesh' },
  { code: 'BDDAC', name: 'Dhaka (ICD)', city: 'Dhaka', cc: 'BD', country: 'Bangladesh' },
  { code: 'BDKAM', name: 'Kamalapur (ICD)', city: 'Dhaka', cc: 'BD', country: 'Bangladesh' },
  { code: 'BDPGN', name: 'Pangaon (ICD)', city: 'Dhaka', cc: 'BD', country: 'Bangladesh' },

  // ── Pakistan (PK) ─────────────────────────────────────────────────────
  { code: 'PKKHI', name: 'Karachi', city: 'Karachi', cc: 'PK', country: 'Pakistan' },
  { code: 'PKBQM', name: 'Port Qasim', city: 'Karachi', cc: 'PK', country: 'Pakistan' },
  { code: 'PKGWD', name: 'Gwadar', city: 'Gwadar', cc: 'PK', country: 'Pakistan' },
  { code: 'PKLHE', name: 'Lahore (ICD)', city: 'Lahore', cc: 'PK', country: 'Pakistan' },

  // ── Sri Lanka (LK) ────────────────────────────────────────────────────
  { code: 'LKCMB', name: 'Colombo', city: 'Colombo', cc: 'LK', country: 'Sri Lanka' },
  { code: 'LKHBA', name: 'Hambantota', city: 'Hambantota', cc: 'LK', country: 'Sri Lanka' },

  // ── Myanmar (MM) ──────────────────────────────────────────────────────
  { code: 'MMRGN', name: 'Yangon', city: 'Yangon', cc: 'MM', country: 'Myanmar' },

  // ── Cambodia (KH) ─────────────────────────────────────────────────────
  { code: 'KHPNH', name: 'Phnom Penh', city: 'Phnom Penh', cc: 'KH', country: 'Cambodia' },
  { code: 'KHKOS', name: 'Sihanoukville', city: 'Sihanoukville', cc: 'KH', country: 'Cambodia' },

  // ── Hong Kong (HK) ────────────────────────────────────────────────────
  { code: 'HKHKG', name: 'Hong Kong', city: 'Hong Kong', cc: 'HK', country: 'Hong Kong' },

  // ── Taiwan (TW) ───────────────────────────────────────────────────────
  { code: 'TWKHH', name: 'Kaohsiung', city: 'Kaohsiung', cc: 'TW', country: 'Taiwan' },
  { code: 'TWKEL', name: 'Keelung', city: 'Keelung', cc: 'TW', country: 'Taiwan' },
  { code: 'TWTXG', name: 'Taichung', city: 'Taichung', cc: 'TW', country: 'Taiwan' },
  { code: 'TWTPE', name: 'Taipei', city: 'Taipei', cc: 'TW', country: 'Taiwan' },
  { code: 'TWTYN', name: 'Taoyuan', city: 'Taoyuan', cc: 'TW', country: 'Taiwan' },
  { code: 'TWNAN', name: 'Nanzhou', city: 'Nanzhou', cc: 'TW', country: 'Taiwan' },

  // ── South Korea (KR) ──────────────────────────────────────────────────
  { code: 'KRPUS', name: 'Busan (Pusan)', city: 'Busan', cc: 'KR', country: 'South Korea' },
  { code: 'KRINC', name: 'Incheon', city: 'Incheon', cc: 'KR', country: 'South Korea' },
  { code: 'KRKAN', name: 'Gwangyang', city: 'Gwangyang', cc: 'KR', country: 'South Korea' },
  { code: 'KRKPO', name: 'Pohang', city: 'Pohang', cc: 'KR', country: 'South Korea' },
  { code: 'KRUSN', name: 'Ulsan', city: 'Ulsan', cc: 'KR', country: 'South Korea' },
  { code: 'KRMAS', name: 'Masan', city: 'Masan', cc: 'KR', country: 'South Korea' },
  { code: 'KRKUV', name: 'Gunsan', city: 'Gunsan', cc: 'KR', country: 'South Korea' },
  { code: 'KRPTK', name: 'Pyeongtaek', city: 'Pyeongtaek', cc: 'KR', country: 'South Korea' },
  { code: 'KRTGH', name: 'Donghae', city: 'Donghae', cc: 'KR', country: 'South Korea' },
  { code: 'KRTSN', name: 'Daesan', city: 'Daesan', cc: 'KR', country: 'South Korea' },

  // ── Japan (JP) ────────────────────────────────────────────────────────
  { code: 'JPTYO', name: 'Tokyo', city: 'Tokyo', cc: 'JP', country: 'Japan' },
  { code: 'JPYOK', name: 'Yokohama', city: 'Yokohama', cc: 'JP', country: 'Japan' },
  { code: 'JPNGO', name: 'Nagoya', city: 'Nagoya', cc: 'JP', country: 'Japan' },
  { code: 'JPUKB', name: 'Kobe', city: 'Kobe', cc: 'JP', country: 'Japan' },
  { code: 'JPOSA', name: 'Osaka', city: 'Osaka', cc: 'JP', country: 'Japan' },
  { code: 'JPHTD', name: 'Hakata (Fukuoka)', city: 'Fukuoka', cc: 'JP', country: 'Japan' },
  { code: 'JPKKJ', name: 'Kitakyushu', city: 'Kitakyushu', cc: 'JP', country: 'Japan' },
  { code: 'JPKIJ', name: 'Niigata', city: 'Niigata', cc: 'JP', country: 'Japan' },
  { code: 'JPCHB', name: 'Chiba', city: 'Chiba', cc: 'JP', country: 'Japan' },
  { code: 'JPKSM', name: 'Kashima', city: 'Kashima', cc: 'JP', country: 'Japan' },
  { code: 'JPOTR', name: 'Otaru', city: 'Otaru', cc: 'JP', country: 'Japan' },
  { code: 'JPTMK', name: 'Tomakomai', city: 'Tomakomai', cc: 'JP', country: 'Japan' },
  { code: 'JPMUR', name: 'Muroran', city: 'Muroran', cc: 'JP', country: 'Japan' },
  { code: 'JPKUH', name: 'Kushiro', city: 'Kushiro', cc: 'JP', country: 'Japan' },
  { code: 'JPHKD', name: 'Hakodate', city: 'Hakodate', cc: 'JP', country: 'Japan' },
  { code: 'JPAKT', name: 'Akita', city: 'Akita', cc: 'JP', country: 'Japan' },
  { code: 'JPHHE', name: 'Hachinohe', city: 'Hachinohe', cc: 'JP', country: 'Japan' },
  { code: 'JPISM', name: 'Ishinomaki', city: 'Ishinomaki', cc: 'JP', country: 'Japan' },
  { code: 'JPSDJ', name: 'Sendai', city: 'Sendai', cc: 'JP', country: 'Japan' },
  { code: 'JPONA', name: 'Onahama', city: 'Onahama', cc: 'JP', country: 'Japan' },
  { code: 'JPKWS', name: 'Kawasaki', city: 'Kawasaki', cc: 'JP', country: 'Japan' },
  { code: 'JPSMZ', name: 'Shimizu', city: 'Shimizu', cc: 'JP', country: 'Japan' },
  { code: 'JPYKK', name: 'Yokkaichi', city: 'Yokkaichi', cc: 'JP', country: 'Japan' },
  { code: 'JPFKY', name: 'Fukuyama', city: 'Fukuyama', cc: 'JP', country: 'Japan' },
  { code: 'JPHIJ', name: 'Hiroshima', city: 'Hiroshima', cc: 'JP', country: 'Japan' },
  { code: 'JPTAK', name: 'Takamatsu', city: 'Takamatsu', cc: 'JP', country: 'Japan' },
  { code: 'JPOJI', name: 'Oita', city: 'Oita', cc: 'JP', country: 'Japan' },
  { code: 'JPKOZ', name: 'Kagoshima', city: 'Kagoshima', cc: 'JP', country: 'Japan' },
  { code: 'JPNAH', name: 'Naha (Okinawa)', city: 'Okinawa', cc: 'JP', country: 'Japan' },
  { code: 'JPMIZ', name: 'Mizushima', city: 'Mizushima', cc: 'JP', country: 'Japan' },
  { code: 'JPMAI', name: 'Maizuru', city: 'Maizuru', cc: 'JP', country: 'Japan' },
  { code: 'JPTRG', name: 'Tsuruga', city: 'Tsuruga', cc: 'JP', country: 'Japan' },
  { code: 'JPTOY', name: 'Toyama', city: 'Toyama', cc: 'JP', country: 'Japan' },
  { code: 'JPKNZ', name: 'Kanazawa', city: 'Kanazawa', cc: 'JP', country: 'Japan' },

  // ── UAE (AE) ──────────────────────────────────────────────────────────
  { code: 'AEJEA', name: 'Jebel Ali', city: 'Dubai', cc: 'AE', country: 'UAE' },
  { code: 'AEAUH', name: 'Abu Dhabi', city: 'Abu Dhabi', cc: 'AE', country: 'UAE' },
  { code: 'AESHJ', name: 'Sharjah', city: 'Sharjah', cc: 'AE', country: 'UAE' },
  { code: 'AEFJR', name: 'Fujairah', city: 'Fujairah', cc: 'AE', country: 'UAE' },
  { code: 'AEKLF', name: 'Khor Al Fakkan', city: 'Khor Al Fakkan', cc: 'AE', country: 'UAE' },
  { code: 'AEAJM', name: 'Ajman', city: 'Ajman', cc: 'AE', country: 'UAE' },
  { code: 'AERKT', name: 'Ras Al Khaimah', city: 'Ras Al Khaimah', cc: 'AE', country: 'UAE' },
  { code: 'AEKHL', name: 'Khalifa Port', city: 'Abu Dhabi', cc: 'AE', country: 'UAE' },
  { code: 'AEARP', name: 'Port Rashid (Dubai)', city: 'Dubai', cc: 'AE', country: 'UAE' },

  // ── Saudi Arabia (SA) ─────────────────────────────────────────────────
  { code: 'SAJED', name: 'Jeddah', city: 'Jeddah', cc: 'SA', country: 'Saudi Arabia' },
  { code: 'SADMM', name: 'Dammam (King Abdul Aziz)', city: 'Dammam', cc: 'SA', country: 'Saudi Arabia' },
  { code: 'SAYNB', name: 'Yanbu', city: 'Yanbu', cc: 'SA', country: 'Saudi Arabia' },
  { code: 'SAJUB', name: 'Jubail', city: 'Jubail', cc: 'SA', country: 'Saudi Arabia' },
  { code: 'SAKAC', name: 'King Abdullah Port', city: 'Rabigh', cc: 'SA', country: 'Saudi Arabia' },
  { code: 'SAJEC', name: 'Jazan', city: 'Jazan', cc: 'SA', country: 'Saudi Arabia' },
  { code: 'SARUH', name: 'Riyadh (ICD)', city: 'Riyadh', cc: 'SA', country: 'Saudi Arabia' },

  // ── Oman (OM) ─────────────────────────────────────────────────────────
  { code: 'OMMUS', name: 'Muscat (Port Sultan Qaboos)', city: 'Muscat', cc: 'OM', country: 'Oman' },
  { code: 'OMSLL', name: 'Salalah', city: 'Salalah', cc: 'OM', country: 'Oman' },
  { code: 'OMSOH', name: 'Sohar', city: 'Sohar', cc: 'OM', country: 'Oman' },
  { code: 'OMDQM', name: 'Duqm', city: 'Duqm', cc: 'OM', country: 'Oman' },

  // ── Qatar (QA) ────────────────────────────────────────────────────────
  { code: 'QAHMD', name: 'Hamad Port (Doha)', city: 'Doha', cc: 'QA', country: 'Qatar' },
  { code: 'QARLF', name: 'Ras Laffan', city: 'Ras Laffan', cc: 'QA', country: 'Qatar' },
  { code: 'QAUMS', name: 'Mesaieed', city: 'Mesaieed', cc: 'QA', country: 'Qatar' },

  // ── Kuwait (KW) ───────────────────────────────────────────────────────
  { code: 'KWKWI', name: 'Kuwait City (Shuwaikh)', city: 'Kuwait City', cc: 'KW', country: 'Kuwait' },

  // ── Bahrain (BH) ──────────────────────────────────────────────────────
  { code: 'BHBAH', name: 'Mina Salman', city: 'Manama', cc: 'BH', country: 'Bahrain' },

  // ── Iran (IR) ─────────────────────────────────────────────────────────
  { code: 'IRBND', name: 'Bandar Abbas', city: 'Bandar Abbas', cc: 'IR', country: 'Iran' },

  // ── Egypt (EG) ────────────────────────────────────────────────────────
  { code: 'EGPSD', name: 'Port Said', city: 'Port Said', cc: 'EG', country: 'Egypt' },
  { code: 'EGALY', name: 'Alexandria', city: 'Alexandria', cc: 'EG', country: 'Egypt' },
  { code: 'EGDAM', name: 'Damietta', city: 'Damietta', cc: 'EG', country: 'Egypt' },
  { code: 'EGEDK', name: 'El Dekheila', city: 'Alexandria', cc: 'EG', country: 'Egypt' },
  { code: 'EGSOK', name: 'Sokhna', city: 'Sokhna', cc: 'EG', country: 'Egypt' },
  { code: 'EGSUZ', name: 'Suez', city: 'Suez', cc: 'EG', country: 'Egypt' },
  { code: 'EGADA', name: 'Al Adabiyah', city: 'Al Adabiyah', cc: 'EG', country: 'Egypt' },

  // ── Turkey (TR) ───────────────────────────────────────────────────────
  { code: 'TRIST', name: 'Istanbul (Ambarli)', city: 'Istanbul', cc: 'TR', country: 'Turkey' },
  { code: 'TRMER', name: 'Mersin', city: 'Mersin', cc: 'TR', country: 'Turkey' },
  { code: 'TRIZM', name: 'Izmir', city: 'Izmir', cc: 'TR', country: 'Turkey' },
  { code: 'TRISK', name: 'Iskenderun', city: 'Iskenderun', cc: 'TR', country: 'Turkey' },
  { code: 'TRGEM', name: 'Gemlik', city: 'Gemlik', cc: 'TR', country: 'Turkey' },
  { code: 'TRBDM', name: 'Bandirma', city: 'Bandirma', cc: 'TR', country: 'Turkey' },
  { code: 'TRHAY', name: 'Haydarpasa', city: 'Istanbul', cc: 'TR', country: 'Turkey' },
  { code: 'TRTEK', name: 'Tekirdag', city: 'Tekirdag', cc: 'TR', country: 'Turkey' },
  { code: 'TRGEB', name: 'Izmit (Gebze)', city: 'Izmit', cc: 'TR', country: 'Turkey' },
  { code: 'TRALI', name: 'Aliaga (Izmir)', city: 'Izmir', cc: 'TR', country: 'Turkey' },
  { code: 'TRSSX', name: 'Samsun', city: 'Samsun', cc: 'TR', country: 'Turkey' },
  { code: 'TRTZX', name: 'Trabzon', city: 'Trabzon', cc: 'TR', country: 'Turkey' },
  { code: 'TRAYT', name: 'Antalya', city: 'Antalya', cc: 'TR', country: 'Turkey' },

  // ── Greece (GR) ───────────────────────────────────────────────────────
  { code: 'GRPIR', name: 'Piraeus', city: 'Athens', cc: 'GR', country: 'Greece' },
  { code: 'GRSKG', name: 'Thessaloniki', city: 'Thessaloniki', cc: 'GR', country: 'Greece' },
  { code: 'GRVOL', name: 'Volos', city: 'Volos', cc: 'GR', country: 'Greece' },
  { code: 'GRHER', name: 'Heraklion', city: 'Heraklion', cc: 'GR', country: 'Greece' },
  { code: 'GRFLS', name: 'Elefsina', city: 'Elefsina', cc: 'GR', country: 'Greece' },

  // ── Italy (IT) ────────────────────────────────────────────────────────
  { code: 'ITGOA', name: 'Genoa', city: 'Genoa', cc: 'IT', country: 'Italy' },
  { code: 'ITLIV', name: 'Livorno', city: 'Livorno', cc: 'IT', country: 'Italy' },
  { code: 'ITGIT', name: 'Gioia Tauro', city: 'Gioia Tauro', cc: 'IT', country: 'Italy' },
  { code: 'ITVCE', name: 'Venezia', city: 'Venice', cc: 'IT', country: 'Italy' },
  { code: 'ITTRS', name: 'Trieste', city: 'Trieste', cc: 'IT', country: 'Italy' },
  { code: 'ITCAG', name: 'Cagliari', city: 'Cagliari', cc: 'IT', country: 'Italy' },
  { code: 'ITSPE', name: 'La Spezia', city: 'La Spezia', cc: 'IT', country: 'Italy' },
  { code: 'ITAOI', name: 'Ancona', city: 'Ancona', cc: 'IT', country: 'Italy' },
  { code: 'ITNAP', name: 'Napoli', city: 'Naples', cc: 'IT', country: 'Italy' },
  { code: 'ITSAL', name: 'Salerno', city: 'Salerno', cc: 'IT', country: 'Italy' },
  { code: 'ITTAR', name: 'Taranto', city: 'Taranto', cc: 'IT', country: 'Italy' },
  { code: 'ITRAN', name: 'Ravenna', city: 'Ravenna', cc: 'IT', country: 'Italy' },
  { code: 'ITPMO', name: 'Palermo', city: 'Palermo', cc: 'IT', country: 'Italy' },
  { code: 'ITSVN', name: 'Savona', city: 'Savona', cc: 'IT', country: 'Italy' },
  { code: 'ITAUG', name: 'Augusta', city: 'Augusta', cc: 'IT', country: 'Italy' },
  { code: 'ITVDL', name: 'Vado Ligure', city: 'Vado Ligure', cc: 'IT', country: 'Italy' },
  { code: 'ITMIL', name: 'Milano (ICD)', city: 'Milan', cc: 'IT', country: 'Italy' },
  { code: 'ITNOL', name: 'Nola (ICD)', city: 'Nola', cc: 'IT', country: 'Italy' },
  { code: 'ITRIV', name: 'Rivalta Scrivia (ICD)', city: 'Rivalta Scrivia', cc: 'IT', country: 'Italy' },
  { code: 'ITBLQ', name: 'Bologna (ICD)', city: 'Bologna', cc: 'IT', country: 'Italy' },
  { code: 'ITMDC', name: 'Marina di Carrara', city: 'Carrara', cc: 'IT', country: 'Italy' },
  { code: 'ITMNF', name: 'Monfalcone', city: 'Monfalcone', cc: 'IT', country: 'Italy' },

  // ── Spain (ES) ────────────────────────────────────────────────────────
  { code: 'ESVLC', name: 'Valencia', city: 'Valencia', cc: 'ES', country: 'Spain' },
  { code: 'ESBCN', name: 'Barcelona', city: 'Barcelona', cc: 'ES', country: 'Spain' },
  { code: 'ESALG', name: 'Algeciras', city: 'Algeciras', cc: 'ES', country: 'Spain' },
  { code: 'ESBIO', name: 'Bilbao', city: 'Bilbao', cc: 'ES', country: 'Spain' },
  { code: 'ESLPG', name: 'Las Palmas', city: 'Las Palmas', cc: 'ES', country: 'Spain' },
  { code: 'ESSCT', name: 'Santa Cruz de Tenerife', city: 'Tenerife', cc: 'ES', country: 'Spain' },
  { code: 'ESSVQ', name: 'Sevilla', city: 'Seville', cc: 'ES', country: 'Spain' },
  { code: 'ESAVS', name: 'Aviles', city: 'Aviles', cc: 'ES', country: 'Spain' },
  { code: 'ESLKN', name: 'La Coruna', city: 'La Coruna', cc: 'ES', country: 'Spain' },
  { code: 'ESMPG', name: 'Marin', city: 'Marin', cc: 'ES', country: 'Spain' },
  { code: 'ESVGO', name: 'Vigo', city: 'Vigo', cc: 'ES', country: 'Spain' },
  { code: 'ESSDR', name: 'Santander', city: 'Santander', cc: 'ES', country: 'Spain' },
  { code: 'ESCAR', name: 'Cartagena', city: 'Cartagena', cc: 'ES', country: 'Spain' },
  { code: 'ESHUV', name: 'Huelva', city: 'Huelva', cc: 'ES', country: 'Spain' },
  { code: 'ESAGP', name: 'Malaga', city: 'Malaga', cc: 'ES', country: 'Spain' },
  { code: 'ESSERE', name: 'Gandia', city: 'Gandia', cc: 'ES', country: 'Spain' },
  { code: 'ESALC', name: 'Alicante', city: 'Alicante', cc: 'ES', country: 'Spain' },
  { code: 'ESTAR', name: 'Tarragona', city: 'Tarragona', cc: 'ES', country: 'Spain' },
  { code: 'ESGIJ', name: 'Gijon', city: 'Gijon', cc: 'ES', country: 'Spain' },
  { code: 'ESMAD', name: 'Madrid (ICD)', city: 'Madrid', cc: 'ES', country: 'Spain' },

  // ── France (FR) ───────────────────────────────────────────────────────
  { code: 'FRLEH', name: 'Le Havre', city: 'Le Havre', cc: 'FR', country: 'France' },
  { code: 'FRMRS', name: 'Marseille', city: 'Marseille', cc: 'FR', country: 'France' },
  { code: 'FRDKK', name: 'Dunkirk', city: 'Dunkirk', cc: 'FR', country: 'France' },
  { code: 'FRFOS', name: 'Fos sur Mer', city: 'Fos sur Mer', cc: 'FR', country: 'France' },
  { code: 'FRLRH', name: 'La Rochelle', city: 'La Rochelle', cc: 'FR', country: 'France' },
  { code: 'FRURO', name: 'Rouen', city: 'Rouen', cc: 'FR', country: 'France' },
  { code: 'FRSXB', name: 'Strasbourg', city: 'Strasbourg', cc: 'FR', country: 'France' },
  { code: 'FRBRD', name: 'Bordeaux', city: 'Bordeaux', cc: 'FR', country: 'France' },
  { code: 'FRSET', name: 'Sete', city: 'Sete', cc: 'FR', country: 'France' },
  { code: 'FRRTG', name: 'Montoir de Bretagne', city: 'Saint-Nazaire', cc: 'FR', country: 'France' },
  { code: 'FRGVL', name: 'Gennevilliers (ICD)', city: 'Paris', cc: 'FR', country: 'France' },
  { code: 'FRPRS', name: 'Paris (ICD)', city: 'Paris', cc: 'FR', country: 'France' },
  { code: 'FRLIO', name: 'Lyon (ICD)', city: 'Lyon', cc: 'FR', country: 'France' },
  { code: 'FRTLS', name: 'Toulouse (ICD)', city: 'Toulouse', cc: 'FR', country: 'France' },

  // ── Belgium (BE) ──────────────────────────────────────────────────────
  { code: 'BEANR', name: 'Antwerp', city: 'Antwerp', cc: 'BE', country: 'Belgium' },
  { code: 'BEZEE', name: 'Zeebrugge', city: 'Zeebrugge', cc: 'BE', country: 'Belgium' },
  { code: 'BEGNT', name: 'Ghent', city: 'Ghent', cc: 'BE', country: 'Belgium' },
  { code: 'BELGG', name: 'Liege (ICD)', city: 'Liege', cc: 'BE', country: 'Belgium' },
  { code: 'BEBOT', name: 'Botlek', city: 'Botlek', cc: 'BE', country: 'Belgium' },
  { code: 'BEKOU', name: 'Kallo', city: 'Kallo', cc: 'BE', country: 'Belgium' },
  { code: 'BEBRX', name: 'Brussels (ICD)', city: 'Brussels', cc: 'BE', country: 'Belgium' },

  // ── Netherlands (NL) ──────────────────────────────────────────────────
  { code: 'NLRTM', name: 'Rotterdam', city: 'Rotterdam', cc: 'NL', country: 'Netherlands' },
  { code: 'NLAMS', name: 'Amsterdam', city: 'Amsterdam', cc: 'NL', country: 'Netherlands' },
  { code: 'NLVLI', name: 'Vlissingen (Flushing)', city: 'Vlissingen', cc: 'NL', country: 'Netherlands' },
  { code: 'NLTNZ', name: 'Terneuzen', city: 'Terneuzen', cc: 'NL', country: 'Netherlands' },
  { code: 'NLDOR', name: 'Dordrecht', city: 'Dordrecht', cc: 'NL', country: 'Netherlands' },
  { code: 'NLMOE', name: 'Moerdijk', city: 'Moerdijk', cc: 'NL', country: 'Netherlands' },
  { code: 'NLIJM', name: 'IJmuiden', city: 'IJmuiden', cc: 'NL', country: 'Netherlands' },
  { code: 'NLEEM', name: 'Eemshaven', city: 'Eemshaven', cc: 'NL', country: 'Netherlands' },
  { code: 'NLVEN', name: 'Venlo (ICD)', city: 'Venlo', cc: 'NL', country: 'Netherlands' },
  { code: 'NLTLB', name: 'Tilburg (ICD)', city: 'Tilburg', cc: 'NL', country: 'Netherlands' },

  // ── Germany (DE) ──────────────────────────────────────────────────────
  { code: 'DEHAM', name: 'Hamburg', city: 'Hamburg', cc: 'DE', country: 'Germany' },
  { code: 'DEBRV', name: 'Bremerhaven', city: 'Bremerhaven', cc: 'DE', country: 'Germany' },
  { code: 'DEBRE', name: 'Bremen', city: 'Bremen', cc: 'DE', country: 'Germany' },
  { code: 'DELBC', name: 'Lubeck', city: 'Lubeck', cc: 'DE', country: 'Germany' },
  { code: 'DEKEL', name: 'Kiel', city: 'Kiel', cc: 'DE', country: 'Germany' },
  { code: 'DERSK', name: 'Rostock', city: 'Rostock', cc: 'DE', country: 'Germany' },
  { code: 'DEWVN', name: 'Wilhelmshaven', city: 'Wilhelmshaven', cc: 'DE', country: 'Germany' },
  { code: 'DEWIS', name: 'Wismar', city: 'Wismar', cc: 'DE', country: 'Germany' },
  { code: 'DEBRB', name: 'Brunsbuttel', city: 'Brunsbuttel', cc: 'DE', country: 'Germany' },
  { code: 'DECUX', name: 'Cuxhaven', city: 'Cuxhaven', cc: 'DE', country: 'Germany' },
  { code: 'DEDUI', name: 'Duisburg (Rhine ICD)', city: 'Duisburg', cc: 'DE', country: 'Germany' },
  { code: 'DEFRA', name: 'Frankfurt (ICD)', city: 'Frankfurt', cc: 'DE', country: 'Germany' },
  { code: 'DEMUC', name: 'Munich (ICD)', city: 'Munich', cc: 'DE', country: 'Germany' },
  { code: 'DEMHG', name: 'Mannheim (Rhine ICD)', city: 'Mannheim', cc: 'DE', country: 'Germany' },
  { code: 'DEDTM', name: 'Dortmund (ICD)', city: 'Dortmund', cc: 'DE', country: 'Germany' },
  { code: 'DENUE', name: 'Nuremberg (ICD)', city: 'Nuremberg', cc: 'DE', country: 'Germany' },
  { code: 'DELEJ', name: 'Leipzig (ICD)', city: 'Leipzig', cc: 'DE', country: 'Germany' },
  { code: 'DEBER', name: 'Berlin (ICD)', city: 'Berlin', cc: 'DE', country: 'Germany' },

  // ── United Kingdom (GB) ───────────────────────────────────────────────
  { code: 'GBFXT', name: 'Felixstowe', city: 'Felixstowe', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBSOU', name: 'Southampton', city: 'Southampton', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBLGP', name: 'London Gateway', city: 'London', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBLIV', name: 'Liverpool', city: 'Liverpool', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBIMM', name: 'Immingham', city: 'Immingham', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBTIL', name: 'Tilbury', city: 'London', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBTHP', name: 'Thamesport', city: 'London', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBHUL', name: 'Hull', city: 'Hull', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBGRG', name: 'Grangemouth', city: 'Grangemouth', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBBRS', name: 'Bristol', city: 'Bristol', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBPRU', name: 'Portbury', city: 'Bristol', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBPME', name: 'Portsmouth', city: 'Portsmouth', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBABD', name: 'Aberdeen', city: 'Aberdeen', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBDVR', name: 'Dover', city: 'Dover', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBHRW', name: 'Harwich', city: 'Harwich', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBGOO', name: 'Goole', city: 'Goole', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBTEE', name: 'Teesport', city: 'Middlesbrough', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBHTP', name: 'Hartlepool', city: 'Hartlepool', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBNSH', name: 'North Shields', city: 'Newcastle', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBGLW', name: 'Glasgow', city: 'Glasgow', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBBEL', name: 'Belfast', city: 'Belfast', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBCDF', name: 'Cardiff', city: 'Cardiff', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBBHM', name: 'Birmingham (ICD)', city: 'Birmingham', cc: 'GB', country: 'United Kingdom' },
  { code: 'GBMNC', name: 'Manchester (ICD)', city: 'Manchester', cc: 'GB', country: 'United Kingdom' },

  // ── Poland (PL) ───────────────────────────────────────────────────────
  { code: 'PLGDN', name: 'Gdansk', city: 'Gdansk', cc: 'PL', country: 'Poland' },
  { code: 'PLGDY', name: 'Gdynia', city: 'Gdynia', cc: 'PL', country: 'Poland' },
  { code: 'PLSZZ', name: 'Szczecin', city: 'Szczecin', cc: 'PL', country: 'Poland' },

  // ── Sweden (SE) ───────────────────────────────────────────────────────
  { code: 'SEGOT', name: 'Gothenburg', city: 'Gothenburg', cc: 'SE', country: 'Sweden' },
  { code: 'SESTK', name: 'Stockholm', city: 'Stockholm', cc: 'SE', country: 'Sweden' },
  { code: 'SEAHU', name: 'Aarhus', city: 'Aarhus', cc: 'SE', country: 'Sweden' },

  // ── Norway (NO) ───────────────────────────────────────────────────────
  { code: 'NOOSL', name: 'Oslo', city: 'Oslo', cc: 'NO', country: 'Norway' },
  { code: 'NOBGO', name: 'Bergen', city: 'Bergen', cc: 'NO', country: 'Norway' },
  { code: 'NOSVG', name: 'Stavanger', city: 'Stavanger', cc: 'NO', country: 'Norway' },

  // ── Denmark (DK) ──────────────────────────────────────────────────────
  { code: 'DKCPH', name: 'Copenhagen', city: 'Copenhagen', cc: 'DK', country: 'Denmark' },
  { code: 'DKAAR', name: 'Aarhus', city: 'Aarhus', cc: 'DK', country: 'Denmark' },

  // ── Finland (FI) ──────────────────────────────────────────────────────
  { code: 'FIHEL', name: 'Helsinki', city: 'Helsinki', cc: 'FI', country: 'Finland' },
  { code: 'FIHKO', name: 'Hamina-Kotka', city: 'Kotka', cc: 'FI', country: 'Finland' },

  // ── Portugal (PT) ─────────────────────────────────────────────────────
  { code: 'PTLIS', name: 'Lisbon', city: 'Lisbon', cc: 'PT', country: 'Portugal' },
  { code: 'PTSIN', name: 'Sines', city: 'Sines', cc: 'PT', country: 'Portugal' },
  { code: 'PTLEI', name: 'Leixoes (Porto)', city: 'Porto', cc: 'PT', country: 'Portugal' },

  // ── Malta (MT) ────────────────────────────────────────────────────────
  { code: 'MTMAR', name: 'Marsaxlokk', city: 'Marsaxlokk', cc: 'MT', country: 'Malta' },

  // ── Slovenia (SI) ─────────────────────────────────────────────────────
  { code: 'SIKOP', name: 'Koper', city: 'Koper', cc: 'SI', country: 'Slovenia' },

  // ── Croatia (HR) ──────────────────────────────────────────────────────
  { code: 'HRRJK', name: 'Rijeka', city: 'Rijeka', cc: 'HR', country: 'Croatia' },

  // ── Russia (RU) ───────────────────────────────────────────────────────
  { code: 'RULED', name: 'Saint Petersburg', city: 'St. Petersburg', cc: 'RU', country: 'Russia' },
  { code: 'RUNVS', name: 'Novorossiysk', city: 'Novorossiysk', cc: 'RU', country: 'Russia' },
  { code: 'RUVVO', name: 'Vladivostok', city: 'Vladivostok', cc: 'RU', country: 'Russia' },

  // ── USA (US) ──────────────────────────────────────────────────────────
  { code: 'USLAX', name: 'Los Angeles', city: 'Los Angeles', cc: 'US', country: 'USA' },
  { code: 'USLGB', name: 'Long Beach', city: 'Long Beach', cc: 'US', country: 'USA' },
  { code: 'USNYC', name: 'New York / Newark', city: 'New York', cc: 'US', country: 'USA' },
  { code: 'USSAV', name: 'Savannah', city: 'Savannah', cc: 'US', country: 'USA' },
  { code: 'USHOU', name: 'Houston', city: 'Houston', cc: 'US', country: 'USA' },
  { code: 'USBAL', name: 'Baltimore', city: 'Baltimore', cc: 'US', country: 'USA' },
  { code: 'USORF', name: 'Norfolk', city: 'Norfolk', cc: 'US', country: 'USA' },
  { code: 'USCHA', name: 'Charleston', city: 'Charleston', cc: 'US', country: 'USA' },
  { code: 'USOAK', name: 'Oakland', city: 'Oakland', cc: 'US', country: 'USA' },
  { code: 'USSEA', name: 'Seattle / Tacoma', city: 'Seattle', cc: 'US', country: 'USA' },
  { code: 'USMIA', name: 'Miami', city: 'Miami', cc: 'US', country: 'USA' },
  { code: 'USNOL', name: 'New Orleans', city: 'New Orleans', cc: 'US', country: 'USA' },
  { code: 'USJAX', name: 'Jacksonville', city: 'Jacksonville', cc: 'US', country: 'USA' },
  { code: 'USPORT', name: 'Portland (OR)', city: 'Portland', cc: 'US', country: 'USA' },
  { code: 'USBOS', name: 'Boston', city: 'Boston', cc: 'US', country: 'USA' },
  { code: 'USPHL', name: 'Philadelphia', city: 'Philadelphia', cc: 'US', country: 'USA' },
  { code: 'USWIL', name: 'Wilmington (NC)', city: 'Wilmington', cc: 'US', country: 'USA' },
  { code: 'USTAC', name: 'Tacoma', city: 'Tacoma', cc: 'US', country: 'USA' },
  { code: 'USCHI', name: 'Chicago (ICD)', city: 'Chicago', cc: 'US', country: 'USA' },
  { code: 'USDAL', name: 'Dallas (ICD)', city: 'Dallas', cc: 'US', country: 'USA' },

  // ── Canada (CA) ───────────────────────────────────────────────────────
  { code: 'CAVAN', name: 'Vancouver', city: 'Vancouver', cc: 'CA', country: 'Canada' },
  { code: 'CAMTR', name: 'Montreal', city: 'Montreal', cc: 'CA', country: 'Canada' },
  { code: 'CAHAL', name: 'Halifax', city: 'Halifax', cc: 'CA', country: 'Canada' },
  { code: 'CAPRR', name: 'Prince Rupert', city: 'Prince Rupert', cc: 'CA', country: 'Canada' },
  { code: 'CASJB', name: 'Saint John', city: 'Saint John', cc: 'CA', country: 'Canada' },
  { code: 'CATOR', name: 'Toronto (ICD)', city: 'Toronto', cc: 'CA', country: 'Canada' },
  { code: 'CAFSD', name: 'Fraser Surrey Docks', city: 'Surrey', cc: 'CA', country: 'Canada' },

  // ── Mexico (MX) ───────────────────────────────────────────────────────
  { code: 'MXLZC', name: 'Lazaro Cardenas', city: 'Lazaro Cardenas', cc: 'MX', country: 'Mexico' },
  { code: 'MXZLO', name: 'Manzanillo', city: 'Manzanillo', cc: 'MX', country: 'Mexico' },
  { code: 'MXVER', name: 'Veracruz', city: 'Veracruz', cc: 'MX', country: 'Mexico' },
  { code: 'MXATM', name: 'Altamira', city: 'Altamira', cc: 'MX', country: 'Mexico' },
  { code: 'MXTAM', name: 'Tampico', city: 'Tampico', cc: 'MX', country: 'Mexico' },
  { code: 'MXESE', name: 'Ensenada', city: 'Ensenada', cc: 'MX', country: 'Mexico' },
  { code: 'MXGYM', name: 'Guaymas', city: 'Guaymas', cc: 'MX', country: 'Mexico' },
  { code: 'MXPGO', name: 'Progreso', city: 'Progreso', cc: 'MX', country: 'Mexico' },
  { code: 'MXCOA', name: 'Coatzacoalcos', city: 'Coatzacoalcos', cc: 'MX', country: 'Mexico' },
  { code: 'MXMEX', name: 'Mexico City (ICD)', city: 'Mexico City', cc: 'MX', country: 'Mexico' },
  { code: 'MXGDL', name: 'Guadalajara (ICD)', city: 'Guadalajara', cc: 'MX', country: 'Mexico' },
  { code: 'MXMTY', name: 'Monterrey (ICD)', city: 'Monterrey', cc: 'MX', country: 'Mexico' },

  // ── Brazil (BR) ───────────────────────────────────────────────────────
  { code: 'BRSSZ', name: 'Santos', city: 'Santos', cc: 'BR', country: 'Brazil' },
  { code: 'BRRIG', name: 'Rio Grande', city: 'Rio Grande', cc: 'BR', country: 'Brazil' },
  { code: 'BRPNG', name: 'Paranagua', city: 'Paranagua', cc: 'BR', country: 'Brazil' },
  { code: 'BRSUA', name: 'Suape', city: 'Suape', cc: 'BR', country: 'Brazil' },
  { code: 'BRITJ', name: 'Itajai', city: 'Itajai', cc: 'BR', country: 'Brazil' },
  { code: 'BRRIO', name: 'Rio de Janeiro', city: 'Rio de Janeiro', cc: 'BR', country: 'Brazil' },
  { code: 'BRFOR', name: 'Fortaleza', city: 'Fortaleza', cc: 'BR', country: 'Brazil' },
  { code: 'BRMAO', name: 'Manaus', city: 'Manaus', cc: 'BR', country: 'Brazil' },
  { code: 'BRSSA', name: 'Salvador (Bahia)', city: 'Salvador', cc: 'BR', country: 'Brazil' },
  { code: 'BRIOA', name: 'Itapoa', city: 'Itapoa', cc: 'BR', country: 'Brazil' },
  { code: 'BRVIX', name: 'Vitoria', city: 'Vitoria', cc: 'BR', country: 'Brazil' },
  { code: 'BRNVT', name: 'Navegantes', city: 'Navegantes', cc: 'BR', country: 'Brazil' },
  { code: 'BRIPO', name: 'Ipojuca (Suape)', city: 'Ipojuca', cc: 'BR', country: 'Brazil' },
  { code: 'BRIBB', name: 'Imbituba', city: 'Imbituba', cc: 'BR', country: 'Brazil' },
  { code: 'BRSPB', name: 'Itaguai', city: 'Itaguai', cc: 'BR', country: 'Brazil' },

  // ── Argentina (AR) ────────────────────────────────────────────────────
  { code: 'ARBUE', name: 'Buenos Aires', city: 'Buenos Aires', cc: 'AR', country: 'Argentina' },
  { code: 'ARRGA', name: 'Rosario', city: 'Rosario', cc: 'AR', country: 'Argentina' },
  { code: 'ARMDQ', name: 'Mar del Plata', city: 'Mar del Plata', cc: 'AR', country: 'Argentina' },

  // ── Chile (CL) ────────────────────────────────────────────────────────
  { code: 'CLVAL', name: 'Valparaiso', city: 'Valparaiso', cc: 'CL', country: 'Chile' },
  { code: 'CLSAI', name: 'San Antonio', city: 'San Antonio', cc: 'CL', country: 'Chile' },
  { code: 'CLIQQ', name: 'Iquique', city: 'Iquique', cc: 'CL', country: 'Chile' },

  // ── Peru (PE) ─────────────────────────────────────────────────────────
  { code: 'PECLL', name: 'Callao (Lima)', city: 'Lima', cc: 'PE', country: 'Peru' },

  // ── Colombia (CO) ─────────────────────────────────────────────────────
  { code: 'COCTG', name: 'Cartagena', city: 'Cartagena', cc: 'CO', country: 'Colombia' },
  { code: 'COBUN', name: 'Buenaventura', city: 'Buenaventura', cc: 'CO', country: 'Colombia' },
  { code: 'COBAQ', name: 'Barranquilla', city: 'Barranquilla', cc: 'CO', country: 'Colombia' },

  // ── Panama (PA) ───────────────────────────────────────────────────────
  { code: 'PACLN', name: 'Colon', city: 'Colon', cc: 'PA', country: 'Panama' },
  { code: 'PAPAI', name: 'Panama City (Balboa)', city: 'Panama City', cc: 'PA', country: 'Panama' },

  // ── South Africa (ZA) ────────────────────────────────────────────────
  { code: 'ZADUR', name: 'Durban', city: 'Durban', cc: 'ZA', country: 'South Africa' },
  { code: 'ZACPT', name: 'Cape Town', city: 'Cape Town', cc: 'ZA', country: 'South Africa' },
  { code: 'ZAPLZ', name: 'Port Elizabeth (Gqeberha)', city: 'Port Elizabeth', cc: 'ZA', country: 'South Africa' },
  { code: 'ZAELS', name: 'East London', city: 'East London', cc: 'ZA', country: 'South Africa' },
  { code: 'ZANGQ', name: 'Ngqura', city: 'Ngqura', cc: 'ZA', country: 'South Africa' },
  { code: 'ZARCB', name: 'Richards Bay', city: 'Richards Bay', cc: 'ZA', country: 'South Africa' },
  { code: 'ZAZBA', name: 'Coega', city: 'Coega', cc: 'ZA', country: 'South Africa' },

  // ── Kenya (KE) ────────────────────────────────────────────────────────
  { code: 'KEMBA', name: 'Mombasa', city: 'Mombasa', cc: 'KE', country: 'Kenya' },
  { code: 'KENBO', name: 'Nairobi (ICD)', city: 'Nairobi', cc: 'KE', country: 'Kenya' },
  { code: 'KELAU', name: 'Lamu', city: 'Lamu', cc: 'KE', country: 'Kenya' },

  // ── Tanzania (TZ) ────────────────────────────────────────────────────
  { code: 'TZDAR', name: 'Dar es Salaam', city: 'Dar es Salaam', cc: 'TZ', country: 'Tanzania' },
  { code: 'TZZAN', name: 'Zanzibar', city: 'Zanzibar', cc: 'TZ', country: 'Tanzania' },

  // ── Nigeria (NG) ──────────────────────────────────────────────────────
  { code: 'NGLOS', name: 'Lagos (Apapa)', city: 'Lagos', cc: 'NG', country: 'Nigeria' },
  { code: 'NGAPP', name: 'Lagos (Apapa NG)', city: 'Lagos', cc: 'NG', country: 'Nigeria' },
  { code: 'NGLKK', name: 'Lekki', city: 'Lagos', cc: 'NG', country: 'Nigeria' },
  { code: 'NGONN', name: 'Onne (Port Harcourt)', city: 'Port Harcourt', cc: 'NG', country: 'Nigeria' },
  { code: 'NGPHC', name: 'Port Harcourt', city: 'Port Harcourt', cc: 'NG', country: 'Nigeria' },

  // ── Ghana (GH) ────────────────────────────────────────────────────────
  { code: 'GHTEM', name: 'Tema', city: 'Accra', cc: 'GH', country: 'Ghana' },
  { code: 'GHTDI', name: 'Takoradi', city: 'Takoradi', cc: 'GH', country: 'Ghana' },

  // ── Morocco (MA) ──────────────────────────────────────────────────────
  { code: 'MATNG', name: 'Tanger Med', city: 'Tangier', cc: 'MA', country: 'Morocco' },
  { code: 'MACAS', name: 'Casablanca', city: 'Casablanca', cc: 'MA', country: 'Morocco' },
  { code: 'MAAGA', name: 'Agadir', city: 'Agadir', cc: 'MA', country: 'Morocco' },

  // ── Djibouti (DJ) ─────────────────────────────────────────────────────
  { code: 'DJJIB', name: 'Djibouti', city: 'Djibouti', cc: 'DJ', country: 'Djibouti' },

  // ── Ethiopia (ET) ─────────────────────────────────────────────────────
  { code: 'ETADD', name: 'Addis Ababa (ICD)', city: 'Addis Ababa', cc: 'ET', country: 'Ethiopia' },

  // ── Australia (AU) ────────────────────────────────────────────────────
  { code: 'AUSYD', name: 'Sydney (Port Botany)', city: 'Sydney', cc: 'AU', country: 'Australia' },
  { code: 'AUMEL', name: 'Melbourne', city: 'Melbourne', cc: 'AU', country: 'Australia' },
  { code: 'AUBNE', name: 'Brisbane', city: 'Brisbane', cc: 'AU', country: 'Australia' },
  { code: 'AUFRE', name: 'Fremantle (Perth)', city: 'Perth', cc: 'AU', country: 'Australia' },
  { code: 'AUADL', name: 'Adelaide', city: 'Adelaide', cc: 'AU', country: 'Australia' },
  { code: 'AUGLT', name: 'Gladstone', city: 'Gladstone', cc: 'AU', country: 'Australia' },
  { code: 'AUDRW', name: 'Darwin', city: 'Darwin', cc: 'AU', country: 'Australia' },
  { code: 'AUTSV', name: 'Townsville', city: 'Townsville', cc: 'AU', country: 'Australia' },
  { code: 'AUDAM', name: 'Dampier', city: 'Dampier', cc: 'AU', country: 'Australia' },
  { code: 'AUPHE', name: 'Port Hedland', city: 'Port Hedland', cc: 'AU', country: 'Australia' },
  { code: 'AUPKL', name: 'Port Kembla', city: 'Port Kembla', cc: 'AU', country: 'Australia' },
  { code: 'AUHBA', name: 'Hobart', city: 'Hobart', cc: 'AU', country: 'Australia' },
  { code: 'AUNTL', name: 'Newcastle', city: 'Newcastle', cc: 'AU', country: 'Australia' },

  // ── New Zealand (NZ) ──────────────────────────────────────────────────
  { code: 'NZAKL', name: 'Auckland', city: 'Auckland', cc: 'NZ', country: 'New Zealand' },
  { code: 'NZTRG', name: 'Tauranga', city: 'Tauranga', cc: 'NZ', country: 'New Zealand' },
  { code: 'NZLYT', name: 'Lyttelton (Christchurch)', city: 'Christchurch', cc: 'NZ', country: 'New Zealand' },
  { code: 'NZWLG', name: 'Wellington', city: 'Wellington', cc: 'NZ', country: 'New Zealand' },

  // ── Israel (IL) ───────────────────────────────────────────────────────
  { code: 'ILASH', name: 'Ashdod', city: 'Ashdod', cc: 'IL', country: 'Israel' },
  { code: 'ILHFA', name: 'Haifa', city: 'Haifa', cc: 'IL', country: 'Israel' },

  // ── Jordan (JO) ───────────────────────────────────────────────────────
  { code: 'JOAQJ', name: 'Aqaba', city: 'Aqaba', cc: 'JO', country: 'Jordan' },
]

export function searchPorts(q: string): Port[] {
  if (!q || q.length < 2) return []
  const lq = q.toLowerCase()
  return PORTS.filter(p =>
    p.code.toLowerCase().includes(lq) ||
    p.name.toLowerCase().includes(lq) ||
    p.city.toLowerCase().includes(lq) ||
    p.country.toLowerCase().includes(lq)
  ).slice(0, 10)
}
