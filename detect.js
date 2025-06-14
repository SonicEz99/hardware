// filepath: c:\Users\User\Desktop\hardware\detect.js
document.addEventListener('DOMContentLoaded', () => {
    initDetection();
});

const URL = "./my_model/";  // แก้ไขพาธให้ถูกต้อง
let model, webcam, labelContainer, maxPredictions;

// ข้อมูลอุปกรณ์
const hardwareInfo = {
    "Cables": {
        name: "สายเคเบิล",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Cables.jpg",
        description: `สายสัญญาณที่ใช้เชื่อมต่ออุปกรณ์คอมพิวเตอร์ต่าง ๆ เช่น สาย USB, HDMI, LAN เป็นต้น
มีหน้าที่ในการส่งข้อมูลหรือพลังงานระหว่างอุปกรณ์เพื่อให้การทำงานราบรื่นและต่อเนื่อง`
    },
    "Case": {
        name: "เคสคอมพิวเตอร์",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Case.jpg",
        description: `โครงสร้างหรือตู้สำหรับบรรจุชิ้นส่วนของคอมพิวเตอร์ เช่น เมนบอร์ด, PSU, การ์ดจอ
ช่วยปกป้องอุปกรณ์ภายในจากฝุ่น ความชื้น และช่วยจัดระเบียบภายในเครื่องให้เรียบร้อย`
    },
    "Cpu": {
        name: "หน่วยประมวลผลกลาง",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Cpu.jpg",
        description: `เป็นสมองหลักของคอมพิวเตอร์ ทำหน้าที่ประมวลผลคำสั่งและข้อมูลจากโปรแกรมต่าง ๆ
ประสิทธิภาพของ CPU ส่งผลโดยตรงต่อความเร็วในการทำงานของเครื่อง`
    },
    "Gpu": {
        name: "การ์ดแสดงผล",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Gpu.jpg",
        description: `อุปกรณ์ประมวลผลกราฟิก ทำหน้าที่แสดงภาพและวิดีโอบนหน้าจออย่างคมชัด
จำเป็นสำหรับงานด้านเกมมิ่ง ตัดต่อวิดีโอ และงานกราฟิกระดับสูง`
    },
    "Hdd": {
        name: "ฮาร์ดดิสก์",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Hdd.jpg",
        description: `อุปกรณ์จัดเก็บข้อมูลถาวร ใช้บันทึกไฟล์ ระบบปฏิบัติการ และโปรแกรมต่าง ๆ
แม้จะช้ากว่า SSD แต่ก็มีราคาย่อมเยาและความจุสูง`
    },
    "Headset": {
        name: "หูฟัง",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Headset.jpg",
        description: `อุปกรณ์ที่รวมลำโพงและไมโครโฟนไว้ด้วยกัน ใช้สำหรับฟังเสียงและสนทนาออนไลน์
เหมาะสำหรับการเล่นเกม ประชุมทางไกล และฟังเพลง
`
    },
    "keyboard": {
        name: "แป้นพิมพ์",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/keyboard.jpg",
        description: `อุปกรณ์อินพุตที่ใช้พิมพ์ตัวอักษร คำสั่ง และควบคุมคอมพิวเตอร์
มีหลากหลายรูปแบบ เช่น Mechanical, Membrane รองรับการใช้งานที่แตกต่างกัน`
    },
    "Monitor": {
        name: "จอภาพ",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Monitor.jpg",
        description: `อุปกรณ์สำหรับแสดงผลลัพธ์จากคอมพิวเตอร์ เช่น ข้อความ รูปภาพ วิดีโอ
คุณภาพของจอภาพมีผลต่อประสบการณ์ใช้งานและความละเอียดของภาพ`
    },
    "Motherboard": {
        name: "เมนบอร์ด",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Motherboard.jpg",
        description: `แผงวงจรหลักที่เชื่อมต่ออุปกรณ์ทุกชิ้นเข้าด้วยกัน เช่น CPU, RAM, GPU
เป็นศูนย์กลางการสื่อสารของอุปกรณ์ภายในเครื่องคอมพิวเตอร์ทั้งหมด`
    },
    "Mouse": {
        name: "เมาส์",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Mouse.jpg",
        description: `อุปกรณ์ชี้ตำแหน่ง ใช้ควบคุมเคอร์เซอร์บนหน้าจอและคลิกคำสั่งต่าง ๆ
มีทั้งแบบมีสายและไร้สาย รวมถึงแบบเฉพาะทางสำหรับเกมหรือการออกแบบ`
    },
    "Ram": {
        name: "หน่วยความจำ",
        image: "https://pub-b63458979cf042379b57054965d6531d.r2.dev/images/Ram.jpg",
        description: `หน่วยความจำชั่วคราวที่คอมพิวเตอร์ใช้เก็บข้อมูลระหว่างการทำงานของโปรแกรม
มีผลโดยตรงต่อความเร็วและความสามารถในการทำงานหลายอย่างพร้อมกัน`
    }
};
document.getElementById("camera-select").addEventListener("change", () => {
    webcam?.stop(); // stop old camera
    initDetection(); // restart with new camera
});
async function initDetection() {
    try {
        updateStatus("กำลังโหลดโมเดล...", "loading");
        console.log("Loading model...");

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        console.log("Model URL:", modelURL);
        console.log("Metadata URL:", metadataURL);

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        console.log("Model loaded successfully");
        console.log("Number of classes:", maxPredictions);

        // Get selected camera facing mode
        const facingMode = document.getElementById("camera-select")?.value || "user";

        const flip = facingMode === "user"; // Flip only if front camera
        webcam = new tmImage.Webcam(400, 400, flip);

        try {
            await webcam.setup({ facingMode }); // Specify front/back
            await webcam.play();
            console.log("Webcam initialized:", facingMode);
        } catch (error) {
            console.error("Webcam error:", error);
            updateStatus("ไม่สามารถเข้าถึงกล้องได้", "error");
            return;
        }

        const webcamContainer = document.getElementById("webcam-container");
        webcamContainer.innerHTML = '';
        webcamContainer.appendChild(webcam.canvas);

        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';

        updateStatus("กำลังตรวจจับ...", "active");
        window.requestAnimationFrame(loop);

    } catch (error) {
        console.error("Initialization error:", error);
        updateStatus("ไม่สามารถโหลดโมเดลได้", "error");
    }
}


async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }
}

// แก้ไขฟังก์ชัน predict
async function predict() {
    try {
        if (!model || !webcam) return;

        const prediction = await model.predict(webcam.canvas);
        let bestPrediction = prediction[0];
        let detectionThreshold = 0.7; // 70% threshold

        // Reset predictions
        prediction.sort((a, b) => b.probability - a.probability);
        bestPrediction = prediction[0];

        // อัพเดทการแสดงผลหลัก
        const mainAccuracy = document.getElementById('main-accuracy');
        const mainLabel = document.getElementById('main-label');
        const accuracy = (bestPrediction.probability * 100).toFixed(1);
        
        // ตรวจสอบว่าควรแสดงผลหรือไม่
        if (bestPrediction.probability >= detectionThreshold) {
            const hardwareData = hardwareInfo[bestPrediction.className];
            if (hardwareData) {
                mainLabel.textContent = hardwareData.name;
                showSampleCard(bestPrediction.className);
            } else {
                mainLabel.textContent = bestPrediction.className;
            }
            mainAccuracy.textContent = `${accuracy}%`;
        } else {
            mainLabel.textContent = "กำลังตรวจจับ...";
            mainAccuracy.textContent = "0%";
            // Hide sample card if confidence is low
            document.getElementById("sample-card").style.display = "none";
        }

        // แสดงผลทั้งหมด
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            const probability = (prediction[i].probability * 100).toFixed(1);
            const hardware = hardwareInfo[prediction[i].className];
            const displayName = hardware ? hardware.name : prediction[i].className;
            
            const div = document.createElement("div");
            div.className = "prediction-item";
            div.innerHTML = `
                <div class="prediction-bar" style="width: ${probability}%"></div>
                <span class="prediction-label">${displayName}</span>
                <span class="prediction-score">${probability}%</span>
            `;
            labelContainer.appendChild(div);
        }

    } catch (error) {
        console.error("Prediction error:", error);
        updateStatus("เกิดข้อผิดพลาดในการตรวจจับ", "error");
    }
}

function showSampleCard(className) {
    const hardware = hardwareInfo[className];
    if (!hardware) return;

    // Show the sample card and panel
    const sampleCard = document.getElementById("sample-card");
    const samplePanel = document.getElementById("sample-panel");
    const sampleImage = document.getElementById("sample-image");
    const sampleName = document.getElementById("sample-name");
    const sampleDescription = document.getElementById("sample-description");
    const detectedLabel = document.getElementById("detected-label");
    const deviceType = document.getElementById("device-type");
    const deviceCategory = document.getElementById("device-category");

    // Update the content
    sampleImage.src = hardware.image;
    sampleName.textContent = hardware.name;
    sampleDescription.textContent = hardware.description;
    detectedLabel.textContent = hardware.name;
    
    // You can add these properties to your hardwareInfo object
    deviceType.textContent = hardware.type || "อุปกรณ์คอมพิวเตอร์"; // Default value if type is not defined
    deviceCategory.textContent = hardware.category || "ฮาร์ดแวร์"; // Default value if category is not defined

    // Show the elements
    sampleCard.style.display = "block";
    samplePanel.style.display = "block";
}

function updateStatus(message, state) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    statusText.textContent = message;
    
    switch (state) {
        case 'loading':
            statusDot.style.backgroundColor = '#FCD34D';
            break;
        case 'ready':
            statusDot.style.backgroundColor = '#34D399';
            break;
        case 'error':
            statusDot.style.backgroundColor = '#EF4444';
            break;
    }
}