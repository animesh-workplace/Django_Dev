// All Calculations ------------------------------------------=>
var color_set = [ '#CD212A', '#FFA500', '#0F4C81', '#55C6A9', '#4A5335', '#798EA4', '#FA7A35', '#00758F', '#EDD59E', '#E8A798', '#9B4722', '#6B5876', '#B89B72', '#282D3C', '#EDF1FE', '#A09998'];
var common_data = cactus_data.filter(d=>d.level==='common');
var uniq_tumor_data = cactus_data.filter(d=>d.level=='uniq' && d.type=='tumor');
var uniq_lk_data = cactus_data.filter(d=>d.level=='uniq' && d.type=='LK');
