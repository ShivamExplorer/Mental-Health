/* ================= 3D SHIVA BACKGROUND ================= */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const renderer = new THREE.WebGLRenderer({canvas:document.getElementById("bgCanvas"),alpha:true});
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.z=6;

const light = new THREE.PointLight(0xffffff,1);
light.position.set(5,5,5);
scene.add(light);

const texture = new THREE.TextureLoader().load("shiva.jpg");

const bg = new THREE.Mesh(
new THREE.PlaneGeometry(20,12),
new THREE.MeshBasicMaterial({map:texture})
);
bg.position.z=-10;
scene.add(bg);

const ring = new THREE.Mesh(
new THREE.TorusGeometry(2,0.3,16,100),
new THREE.MeshStandardMaterial({color:0x8b5cf6,wireframe:true})
);
scene.add(ring);

function animate(){
requestAnimationFrame(animate);
ring.rotation.x+=0.01;
ring.rotation.y+=0.01;
renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
renderer.setSize(window.innerWidth,window.innerHeight);
camera.aspect=window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
});

/* ================= QUIZ SYSTEM ================= */

let scores={Depression:0,Anxiety:0,OCD:0,Bipolar:0,Stress:0};
let primary="";
let detailedScore=0;

/* 20 Screening Questions */

const questions=[
["Persistent sadness?","Depression"],
["Loss of interest?","Depression"],
["Excess worry?","Anxiety"],
["Panic attacks?","Anxiety"],
["Intrusive thoughts?","OCD"],
["Compulsive behavior?","OCD"],
["Mood highs?","Bipolar"],
["Sleep less but energetic?","Bipolar"],
["Chronic stress?","Stress"],
["Burnout?","Stress"],
["Hopelessness?","Depression"],
["Restlessness?","Anxiety"],
["Irritability?","Stress"],
["Racing thoughts?","Anxiety"],
["Repetitive doubts?","OCD"],
["Impulsivity?","Bipolar"],
["Low energy?","Depression"],
["Fear without reason?","Anxiety"],
["Order obsession?","OCD"],
["Mood swings affecting life?","Bipolar"]
];

/* Render Screening */

questions.forEach((q,i)=>{
screeningQuestions.innerHTML+=`
<p>${i+1}. ${q[0]}</p>
<select id="q${i}">
<option value="0">Never</option>
<option value="1">Sometimes</option>
<option value="2">Often</option>
<option value="3">Severe</option>
</select>
`;
});

/* Start */

function startScreening(){
login.classList.add("hidden");
screening.classList.remove("hidden");
}

/* Analyze */

function analyzeScreening(){

scores={Depression:0,Anxiety:0,OCD:0,Bipolar:0,Stress:0};

questions.forEach((q,i)=>{
scores[q[1]]+=parseInt(document.getElementById("q"+i).value);
});

primary=Object.keys(scores).reduce((a,b)=>scores[a]>scores[b]?a:b);

showScreeningChart(scores);

screening.classList.add("hidden");
detailed.classList.remove("hidden");

dTitle.innerText="Detailed Test: "+primary;

for(let i=0;i<10;i++){
detailedQuestions.innerHTML+=`
<p>Severity Question ${i+1}</p>
<select id="d${i}">
<option value="0">None</option>
<option value="1">Mild</option>
<option value="2">Moderate</option>
<option value="3">Severe</option>
</select>
`;
}
}

/* Severity */

function getSeverity(score){
if(score<8) return "Mild";
if(score<16) return "Moderate";
if(score<22) return "High";
return "Critical";
}

/* Report */

function generateReport(){

detailedScore=0;

for(let i=0;i<10;i++){
detailedScore+=parseInt(document.getElementById("d"+i).value);
}

let severity=getSeverity(detailedScore);

detailed.classList.add("hidden");
report.classList.remove("hidden");

result.innerText="Detected: "+primary;
severity.innerText="Severity: "+severity;

showRadar([3,4,2,5,3]);

let yt=`https://www.youtube.com/results?search_query=${primary}+yoga+meditation+therapy`;

recommendations.innerHTML=`
<h4>Diet</h4>
<p>Balanced protein, omega-3, reduce sugar & caffeine.</p>

<h4>Exercise</h4>
<p>30 min daily physical activity.</p>

<button onclick="window.open('${yt}')">YouTube Therapy</button>
`;

}

/* Charts */

function showScreeningChart(data){
new Chart(document.getElementById("screeningChart"),{
type:"bar",
data:{
labels:Object.keys(data),
datasets:[{
label:"Risk Score",
data:Object.values(data),
backgroundColor:"#7b00ff"
}]
}
});
}

function showRadar(values){
new Chart(document.getElementById("radarChart"),{
type:"radar",
data:{
labels:["Mood","Anxiety","Sleep","Focus","Energy"],
datasets:[{
label:"Profile",
data:values,
borderColor:"#00c3ff",
backgroundColor:"rgba(0,195,255,0.2)"
}]
}
});
}

/* Doctor Search */

function findDoctor(){
let budget=document.getElementById("budget").value;

let query="psychiatrist near me";

if(budget==="low") query="government psychiatrist near me";
if(budget==="high") query="best psychiatrist near me";

window.open("https://www.google.com/maps/search/"+query);
}

function findHospital(){
window.open("https://www.google.com/maps/search/mental+health+hospital+near+me");
}