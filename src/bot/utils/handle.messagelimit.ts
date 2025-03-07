
export const handleLimit = (msg:string) => {
    if(!msg || msg === undefined) return
    console.log(msg)
    let chunks:Array<string> = [];
    let currentChunk = "";
    if (msg.length < 4000) return [msg]
    let paragraphs = msg.split("\n\n");
    // console.log(paragraphs);
    for (let i = 0; i < paragraphs.length; i++) {
        if (currentChunk.length + paragraphs[i].length + 2 > 4000) {
            if (currentChunk.length > 0) {
                chunks.push(currentChunk);
                currentChunk = "";
            }
            if (paragraphs[i].length > 4000) {
                const sentences = paragraphs[i].split(/(?<=\.|\?|\!) /g);
                for (const sentence of sentences) {
                    if (currentChunk.length + sentence.length > 4000) {
                        if (currentChunk.length > 0) {
                            chunks.push(currentChunk);
                            currentChunk = "";
                        }
                        else {

                            currentChunk = sentence
                        }
                    }else {
                        currentChunk += (currentChunk.length > 0 ? " " : "") + sentence
                    }
                }
                
            }else {
                currentChunk = paragraphs[i]
            }

        }else {
            currentChunk = (currentChunk.length > 0 ? "\n\n" : "") + paragraphs[i]
        }
        if(currentChunk.length > 0) {
            chunks.push(currentChunk)
        }
    }
    // console.log(chunks);
    return chunks
};

// handleLimit(msg);
