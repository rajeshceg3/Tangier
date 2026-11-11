// Illustrated coastal-city sound palette, not field recordings.
export const SOUND_PLACES=[
 {id:'rooftops',beds:[{type:'wind',params:{baseCutoff:630,gustDepth:.8},gain:.38},{type:'surf',params:{lowpass:400,period:9,swash:.2},gain:.13}],voices:[{kind:'gull',weight:1,gain:.1}],voiceGap:[16,32]},
 {id:'medina',beds:[{type:'wind',params:{baseCutoff:250,gustDepth:.35},gain:.36}],voices:[{kind:'dove',weight:1,gain:.12}],voiceGap:[14,30]},
 {id:'kasbah',beds:[{type:'wind',params:{baseCutoff:500,gustDepth:.7},gain:.42}],voices:[{kind:'dove',weight:1,gain:.11},{kind:'gull',weight:.5,gain:.08}],voiceGap:[16,32]},
 {id:'strait',beds:[{type:'surf',params:{lowpass:1000,period:8,swash:.55},gain:.4},{type:'wind',params:{baseCutoff:800,gustDepth:.8},gain:.22}],voices:[{kind:'gull',weight:1,gain:.12},{kind:'putter',weight:.5,gain:.09}],voiceGap:[14,32]},
];
