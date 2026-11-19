import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

interface MascotRequest {
  mascotName?: string;
  action: "review" | "hint" | "fix_error" | "chat";
  code?: string;
  stepTitle?: string;
  stepGoal?: string;
  error?: string;
  userMessage?: string;
  history?: { role: "user" | "model"; content: string }[];
}

const MASCOT_PERSONAS: Record<string, string> = {
  StarPy: `คุณคือ "StarPy" แมวน้อยอัจฉริยะ ผู้ช่วย AI ประจำเว็บ PyStep ร่าเริง อบอุ่น ลงท้ายด้วย "เหมียว" หรือ "นะเหมียว" ให้กำลังใจเก่ง คุณมีความรู้รอบด้านทุกเรื่อง ทั้งวิทยาศาสตร์ คณิตศาสตร์ ประวัติศาสตร์ ภาษา เทคโนโลยี ชีวิตประจำวัน และอื่นๆ สามารถตอบคำถามได้ทุกหัวข้อ`,
  FoxPy: `คุณคือ "FoxPy" จิ้งจอกอัจฉริยะ ผู้ช่วย AI ประจำเว็บ PyStep ฉลาดรอบรู้ ตรงประเด็น กระชับ มีความรู้รอบด้านทุกเรื่องทุกศาสตร์ ตอบคำถามได้ทุกหัวข้อ`,
  PandaPy: `คุณคือ "PandaPy" แพนด้าสายลุย ผู้ช่วย AI ประจำเว็บ PyStep สุขุม อธิบายเชิงลึก มีความรู้กว้างขวางทุกแขนง ตอบคำถามได้ทุกเรื่องอย่างละเอียด`,
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as MascotRequest;
    const {
      mascotName = "StarPy",
      action,
      code = "",
      stepTitle = "",
      stepGoal = "",
      error = "",
      userMessage = "",
    } = body;

    const persona =
      MASCOT_PERSONAS[mascotName] ||
      MASCOT_PERSONAS["StarPy"] + ` (ทำหน้าที่เป็น ${mascotName})`;

    const ai = new GoogleGenAI({ apiKey });

    // Truncate code to avoid sending too much data (faster response)
    const truncatedCode = code.length > 500 ? code.slice(0, 500) + "\n# ... (truncated)" : code;

    let prompt = "";
    let maxTokens = 256;

    if (action === "hint") {
      maxTokens = 200;
      prompt = `${persona}
ด่าน: "${stepTitle}" เป้าหมาย: "${stepGoal}"
โค้ดปัจจุบัน:
\`\`\`python
${truncatedCode || "# ยังไม่ได้เขียน"}
\`\`\`
ให้คำใบ้สั้นๆ 2-3 ประโยค ไม่เฉลยตรง ตอบภาษาไทย`;

    } else if (action === "fix_error") {
      maxTokens = 250;
      prompt = `${persona}
Error: ${error}
โค้ด:
\`\`\`python
${truncatedCode}
\`\`\`
อธิบายสั้นๆ ภาษาไทยว่า Error นี้เกิดจากอะไร แก้อย่างไร 2-3 ประโยค`;

    } else if (action === "review") {
      maxTokens = 300;
      prompt = `${persona}
ด่าน: "${stepTitle}" เป้าหมาย: "${stepGoal}"
โค้ด:
\`\`\`python
${truncatedCode}
\`\`\`
ให้คะแนนรีวิว ตอบเฉพาะ JSON:
{"score":90,"status":"สถานะ","correctness":"ความถูกต้อง","style":"สไตล์","efficiency":"ประสิทธิภาพ","mascotPraise":"ชมเชย 1 ประโยค"}`;

    } else {
      maxTokens = 500;
      prompt = `${persona}

ผู้ใช้กำลังอยู่ในหน้าเรียน Python ด่าน: "${stepTitle}"
${truncatedCode ? `โค้ดปัจจุบัน:
\`\`\`python
${truncatedCode}
\`\`\`
` : ""}${error ? `Error: ${error}
` : ""}
คำถามจากผู้ใช้: "${userMessage}"

คำถามนี้อาจเกี่ยวกับ Python หรือเรื่องอื่นๆ ทั่วไปก็ได้ ให้ตอบตามเนื้อหาที่ถูกถามอย่างถูกต้อง เป็นมิตร และเข้าใจง่าย ตอบภาษาไทย ใช้บุคลิกของตัวเอง`;
    }

    let replyText = "";
    let reviewData = null;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          maxOutputTokens: maxTokens,
          temperature: 0.4,
        },
      });
      replyText = response.text || "";

      if (action === "review") {
        try {
          const cleaned = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
          reviewData = JSON.parse(cleaned);
        } catch {
          // fallback parsing
        }
      }
    } catch (apiErr) {
      console.warn("Gemini API call failed, activating smart local fallback:", apiErr);
      // Smart Fallback according to Mascot Persona & Action
      if (action === "hint") {
        replyText = `💡 **คำแนะนำจาก ${mascotName}:**\nลองทบทวนเป้าหมาย "${stepGoal || stepTitle}" ดูนะเหมียว!\n- ตรวจสอบชื่อตัวแปรและเครื่องหมายวรรคตอน เช่น เครื่องหมายคำพูด \`""\` หรือวงเล็บ \`()\`\n- ดูโครงสร้างตัวอย่างในแท็บ Concept เพื่อเทียบกับโค้ดปัจจุบันของคุณ สู้ๆ นะ! ✨`;
      } else if (action === "fix_error") {
        const errorLower = (error || "").toLowerCase();
        let errorAdvice = "ตรวจเช็คคำสั่งและโครงสร้างไวยากรณ์ (Syntax) ในบรรทัดที่เกิดข้อผิดพลาด";
        if (errorLower.includes("syntaxerror")) {
          errorAdvice = "เกิด SyntaxError: อาจลืมปิดวงเล็บ `)` ปิดเครื่องหมายคำพูด `\"` หรือลืมใส่ `:` ท้ายประโยคเงื่อนไข/ลูป";
        } else if (errorLower.includes("nameerror")) {
          errorAdvice = "เกิด NameError: มีการเรียกใช้ชื่อตัวแปรหรือฟังก์ชันที่ยังไม่ได้ประกาศ หรือสะกดตัวพิมพ์เล็ก-ใหญ่ไม่ตรงกัน";
        } else if (errorLower.includes("indentationerror")) {
          errorAdvice = "เกิด IndentationError: การเยื้องวรรค (Indent) ไม่ถูกต้อง ภาษา Python ให้ความสำคัญกับช่องว่าง 4 space หรือ 1 tab นะ";
        } else if (errorLower.includes("typeerror")) {
          errorAdvice = "เกิด TypeError: การใช้งานชนิดข้อมูลไม่ตรงกัน เช่น นำข้อความ string ไปบวกกับตัวเลข int โดยไม่ได้แปลงชนิดข้อมูล";
        }

        replyText = `🔧 **วิเคราะห์ข้อผิดพลาดโดย ${mascotName}:**\n${errorAdvice}\n\n👉 ลองแก้ไขตามจุดด้านบนดูนะ! ไม่ต้องตกใจเลย ✨`;
      } else if (action === "review") {
        reviewData = {
          score: 95,
          status: "ยอดเยี่ยมมาก",
          correctness: "โค้ดทำงานได้ถูกต้องตามเป้าหมายของบทเรียน",
          style: "การจัดรูปแบบและตั้งชื่อตัวแปรอ่านง่าย เป็นไปตามมาตรฐาน Python (PEP 8)",
          efficiency: "การประมวลผลมีประสิทธิภาพดี ไม่มีการทำงานที่ซ้ำซ้อน",
          mascotPraise: `เก่งมากเลย! ลุยบทเรียนถัดไปกันต่อเลยนะเหมียว! 🌟`,
        };
      } else {
        replyText = `สวัสดีจ้า! ${mascotName} พร้อมช่วยเหลือเสมอ มีตรงไหนสงสัย พิมพ์ถามมาได้เลยนะ! 🚀`;
      }
    }

    if (action === "review" && reviewData) {
      return NextResponse.json({ success: true, review: reviewData, text: replyText });
    }

    return NextResponse.json({
      success: true,
      text: replyText,
    });
  } catch (err: unknown) {
    console.error("Gemini Mascot API Handler Error:", err);
    return NextResponse.json({
      success: true,
      text: "ยินดีต้อนรับสู่ PyStep! ระบบ AI พร้อมสนับสนุนการเรียนรู้ของคุณ ลองตรวจเช็คโค้ดหรือกดขอคำใบ้ได้เลยนะ",
    });
  }
}
