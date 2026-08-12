
var TEST_FREQUENCIES=[16000,14000,12000,10000,8000];
var LABELS={16000:"16 kHz",14000:"14 kHz",12000:"12 kHz",10000:"10 kHz",8000:"8 kHz"};
var step=0, answers={};

function show(id){
  var pages=document.getElementsByClassName("page");
  for(var i=0;i<pages.length;i++) pages[i].className="page";
  document.getElementById(id).className="page active";
  window.scrollTo(0,0);
}
function stopAudio(){
  var a=document.getElementsByTagName("audio");
  for(var i=0;i<a.length;i++){try{a[i].pause();a[i].currentTime=0;}catch(e){}}
}
function goCalibration(){stopAudio();show("calibration")}
function toggleStart(){document.getElementById("startTestBtn").disabled=!document.getElementById("comfortable").checked}
function startTest(){step=0;answers={};stopAudio();show("test");renderStep()}
function renderStep(){
  var f=TEST_FREQUENCIES[step];
  document.getElementById("bar").style.width=((step)/TEST_FREQUENCIES.length*100)+"%";
  document.getElementById("progressText").innerHTML="เสียงที่ "+(step+1)+" จาก "+TEST_FREQUENCIES.length;
  document.getElementById("toneNumber").innerHTML=(step+1)+" / "+TEST_FREQUENCIES.length;
  document.getElementById("freqAdmin").innerHTML="เสียงขณะนี้: "+LABELS[f];
  var audio=document.getElementById("testAudio");
  audio.pause();audio.src="sounds/tone_"+f+".wav";audio.load();
}
function answer(value){
  stopAudio();
  answers[TEST_FREQUENCIES[step]]=value;
  if(step<TEST_FREQUENCIES.length-1){step++;renderStep()}else{renderResult();show("result")}
}
function calculate(){
  var heard=[], unsure=[];
  for(var i=0;i<TEST_FREQUENCIES.length;i++){
    var f=TEST_FREQUENCIES[i], a=answers[f];
    if(a==="heard") heard.push(f);
    if(a==="unsure") unsure.push(f);
  }
  var h=heard.length?Math.max.apply(null,heard):0;
  if(h>=16000)return {color:"green",icon:"🟢",status:"ได้ยินเสียงสูงดีมาก",age:"ประมาณไม่เกิน 25 ปี",summary:"คุณได้ยินเสียงความถี่สูงสุดของกิจกรรมนี้ ผลอยู่ในกลุ่มสีเขียว",rec:"รักษาหูให้ดีต่อไป ลดความดังของหูฟัง และพักหูเมื่ออยู่ในบริเวณเสียงดัง",highest:h};
  if(h>=14000)return {color:"green",icon:"🟢",status:"การรับเสียงสูงอยู่ในกลุ่มดี",age:"ประมาณ 20–35 ปี",summary:"คุณยังรับรู้เสียงความถี่สูงได้ดี ผลกิจกรรมอยู่ในกลุ่มสีเขียว",rec:"ใช้ระดับเสียงหูฟังอย่างปลอดภัย และหลีกเลี่ยงการฟังเสียงดังเป็นเวลานาน",highest:h};
  if(h>=12000)return {color:"yellow",icon:"🟡",status:"เสียงสูงบางช่วงเริ่มฟังยาก",age:"ประมาณ 30–45 ปี",summary:"ผลอยู่ในกลุ่มสีเหลือง แต่อุปกรณ์และหูฟังอาจสร้างเสียงช่วงนี้ได้ไม่สมบูรณ์",rec:"ลองตรวจซ้ำในบริเวณเงียบด้วยหูฟังอีกชุดหนึ่ง และทบทวนพฤติกรรมการฟังเสียงดัง",highest:h};
  if(h>=10000)return {color:"yellow",icon:"🟡",status:"ควรใส่ใจสุขภาพการได้ยิน",age:"ประมาณ 40–55 ปี",summary:"คุณได้ยินชัดเจนถึงประมาณ 10 kHz ผลกิจกรรมอยู่ในกลุ่มสีเหลือง",rec:"ควรตรวจซ้ำในที่เงียบ หากมีหูอื้อ ฟังคำพูดไม่ชัด หรือผลต่างจากเพื่อนมาก ให้รับการตรวจการได้ยิน",highest:h};
  if(h>=8000)return {color:"red",icon:"🔴",status:"แนะนำให้ตรวจการได้ยินเพิ่มเติม",age:"ประมาณ 55 ปีขึ้นไป",summary:"กิจกรรมนี้พบว่าคุณรับเสียงสูงได้ถึงประมาณ 8 kHz แต่ยังสรุปว่าเป็นการสูญเสียการได้ยินไม่ได้",rec:"ลองทดสอบซ้ำด้วยหูฟังที่เชื่อถือได้ในบริเวณเงียบ หากได้ผลเช่นเดิม ควรรับการตรวจด้วย audiometer",highest:h};
  if(unsure.length)return {color:"red",icon:"🔴",status:"ผลยังไม่ชัดเจน",age:"ยังคาดการณ์ไม่ได้",summary:"คุณไม่แน่ใจหลายเสียง อาจเกิดจากเสียงรบกวน การตั้งระดับเสียง หรือข้อจำกัดของหูฟัง",rec:"เปลี่ยนหูฟัง ตรวจการเชื่อมต่อ และเริ่มใหม่ในพื้นที่เงียบ หากยังไม่ได้ยินเสียงตัวอย่าง ไม่ควรใช้ผลครั้งนี้",highest:0};
  return {color:"red",icon:"🔴",status:"ไม่พบการตอบสนองต่อเสียงทดสอบ",age:"ยังคาดการณ์ไม่ได้",summary:"อาจเกิดจากหูฟัง อุปกรณ์ ระดับเสียง หรือการได้ยินเสียงความถี่สูงลดลง",rec:"ตรวจว่าหูฟังทำงานและฟังเสียงตัวอย่าง 1,000 Hz ได้ก่อน หากเสียงตัวอย่างได้ยินแต่ไม่ได้ยินเสียงทดสอบ ควรรับการตรวจการได้ยินเพิ่มเติม",highest:0};
}
function renderResult(){
  var r=calculate(), card=document.getElementById("resultCard");
  card.className="result-card result-"+r.color;
  document.getElementById("resultIcon").innerHTML=r.icon;
  document.getElementById("resultStatus").innerHTML=r.status;
  document.getElementById("resultAge").innerHTML=r.age;
  document.getElementById("resultSummary").innerHTML=r.summary;
  document.getElementById("highestBox").innerHTML=r.highest?("เสียงสูงสุดที่ตอบว่าได้ยิน<br><strong>"+LABELS[r.highest]+"</strong>"):"";
  var rec=document.getElementById("recommendation");
  rec.className="alert "+(r.color==="green"?"info":r.color==="yellow"?"warning":"danger");
  rec.innerHTML=r.rec;
  var map={heard:"✅ ได้ยิน",unsure:"🤔 ไม่แน่ใจ",not_heard:"❌ ไม่ได้ยิน"}, s="";
  for(var i=0;i<TEST_FREQUENCIES.length;i++){var f=TEST_FREQUENCIES[i];s+="<p><b>"+LABELS[f]+":</b> "+(map[answers[f]]||"— ไม่ได้ตอบ")+"</p>"}
  document.getElementById("allAnswers").innerHTML=s;
}
function resetAll(){
  stopAudio();step=0;answers={};
  document.getElementById("comfortable").checked=false;
  toggleStart();show("welcome");
}
