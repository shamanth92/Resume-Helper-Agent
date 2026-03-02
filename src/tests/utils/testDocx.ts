import * as fs from 'fs';
import { AlignmentType, Document, HeadingLevel, Paragraph, Packer } from "docx";

const testDocx = () => {
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        text: "Hello World",
                        heading: HeadingLevel.HEADING_1
                    }),
                    new Paragraph({
                        text: "This is a paragraph",
                        alignment: AlignmentType.CENTER
                    })
                ]
            }
        ]
    })

    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("test.docx", buffer);
        console.log("✅ Document created: test.docx");
    });
}

testDocx();