import { evaluate, format, MathType } from 'mathjs';
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import domtoimage from 'dom-to-image-more';

const LOCAL_STORAGE_KEY = 'text-calcer-data';

export function TextCalcApp() {
    const [lines, setLines] = useState<{ input: string; result: string }>(() => {
        // 从 localStorage 加载完整数据
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch {
                return { input: '', result: '' };
            }
        }
        return { input: '', result: '' };
    });

    // 监听 lines 变化，存储完整数据
    useEffect(() => {
        if (lines.input !== '' || lines.result !== '') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lines));
        }
    }, [lines]);

    const handleInputChange = (value: string) => {
        const inputLines = value.split('\n');
        const resultLines = [];

        for (const line of inputLines) {
            const { lineWithoutComment, comment } = HandleOneLine(line);

            if (lineWithoutComment === "") {
                resultLines.push(comment);
                continue
            }

            // 检查 lineWithoutComment 是否是纯数字
            if (/^\d+(\.\d+)?$/.test(lineWithoutComment)) {  // 整数或小数
                resultLines.push(lineWithoutComment);
                continue;
            }

            let result = GetLineNoCommentResult(lineWithoutComment);
            if (comment) { //发生异常的时候 也显示注释
                result += `    ${comment}`;
            }
            resultLines.push(result);
        }

        setLines({ input: value, result: resultLines.join('\n') });
    };

    const handleScreenshot = async () => {
        // 获取原始结果区域的宽度
        const originalResult = document.querySelector('.container .grid > div:last-child');
        if (!originalResult) return;
        
        // 创建临时容器
        const tempContainer = document.createElement('div');
        tempContainer.style.padding = '20px';
        tempContainer.style.backgroundColor = '#ffffff';
        tempContainer.style.borderRadius = '8px';
        tempContainer.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        tempContainer.style.width = getComputedStyle(originalResult).width; // 保持与UI相同的宽度
        
        // 只克隆右侧结果TextArea
        const resultClone = originalResult.cloneNode(true) as HTMLElement;
        
        if (resultClone) {
            // 应用白底黑字样式
            const textarea = resultClone.querySelector('textarea');
            if (textarea) {
                textarea.style.backgroundColor = '#ffffff';
                textarea.style.color = '#000000';
                textarea.style.fontFamily = 'Menlo, Monaco, Consolas, monospace';
                textarea.style.fontSize = '14px';
                textarea.style.lineHeight = '1.5';
                textarea.style.border = '1px solid #e0e0e0';
                textarea.style.boxShadow = 'none';
                textarea.style.width = '100%';
            }
    
            tempContainer.appendChild(resultClone);
            document.body.appendChild(tempContainer);
            
            try {
                const blob = await domtoimage.toBlob(tempContainer, {
                    quality: 1,
                    style: {
                        transform: 'none'
                    },
                    bgcolor: '#ffffff'
                });
                
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                
                // 显示成功提示并在1秒后消失
                const successAlert = document.createElement('div');
                successAlert.textContent = '结果截图已复制到剪贴板';
                successAlert.style.position = 'fixed';
                successAlert.style.top = '20px';
                successAlert.style.right = '20px';
                successAlert.style.padding = '10px 20px';
                successAlert.style.backgroundColor = '#4CAF50';
                successAlert.style.color = 'white';
                successAlert.style.borderRadius = '4px';
                successAlert.style.zIndex = '9999';
                document.body.appendChild(successAlert);
                
                setTimeout(() => {
                    document.body.removeChild(successAlert);
                }, 1000);
            } catch (error) {
                console.error('截图失败:', error);
                
                // 显示失败提示并在1秒后消失
                const errorAlert = document.createElement('div');
                errorAlert.textContent = '截图失败，请重试';
                errorAlert.style.position = 'fixed';
                errorAlert.style.top = '20px';
                errorAlert.style.right = '20px';
                errorAlert.style.padding = '10px 20px';
                errorAlert.style.backgroundColor = '#f44336';
                errorAlert.style.color = 'white';
                errorAlert.style.borderRadius = '4px';
                errorAlert.style.zIndex = '9999';
                document.body.appendChild(errorAlert);
                
                setTimeout(() => {
                    document.body.removeChild(errorAlert);
                }, 1000);
            } finally {
                document.body.removeChild(tempContainer);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-end mb-4">
                <Button onClick={handleScreenshot} variant="outline">
                    截图
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {/* 两个TextArea保持不变 */}
                <div className="flex flex-col space-y-2">
                    <Textarea
                        value={lines.input}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="输入公式, 例如: 20*10"
                        className="w-full min-h-[calc(90vh-1rem)] md:text-2xl font-mono"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <Textarea
                        value={lines.result}
                        readOnly
                        className="w-full min-h-[calc(90vh-1rem)] font-bold md:text-2xl"
                    />
                </div>
            </div>
        </div>
    );
}

function formatEvalResultNumber(evalResult: number, needPercent: boolean): string {
    if (Number.isInteger(evalResult)) return evalResult.toString();

    const formatted = format(evalResult, { notation: 'fixed', precision: 4 });
    let res = parseFloat(formatted).toString();

    // 太大的值没有必要显示百分比
    if (needPercent && evalResult< 3) {
        const temp = format(evalResult * 100 - 100, { notation: 'fixed', precision: 2 })
        const fix = evalResult > 1 ? "+":""
        const percent = fix + parseFloat(temp).toString() + "%";
        res = `${res}(${percent})`;
    }
    return res
}

function formatEvalResult(evalResult: MathType, needPercent: boolean): string {
    if (typeof evalResult === 'number') {
        return formatEvalResultNumber(evalResult, needPercent)
    } else if (typeof evalResult === 'string') {
        return evalResult;
    } else if (evalResult && typeof evalResult === 'object' && 'type' in evalResult) {
        if (evalResult.type === 'Complex') {
            return format(evalResult, { notation: 'auto' });
        } else if (evalResult.type === 'BigNumber') {
            return format(evalResult, { notation: 'auto', precision: 14 });
        } else if (evalResult.type === 'Unit') {
            return format(evalResult);
        } else {
            return format(evalResult);
        }
    }
    return "";
}


/** 分解成注释和公式两部分 */
function HandleOneLine(line: string) {
    const trimmedLine = line.trim();
    // 1. 尝试查找注释
    const commentMatch = trimmedLine.match(/#\s*(.+)/);  // 捕获 # 后面的任意字符
    let comment = '';
    if (commentMatch) {
        comment = commentMatch[1];  // commentMatch[1] 是第一个捕获组的内容
    }
    // 2. 移除注释部分，再进行计算.
    const lineWithoutComment = trimmedLine.replace(/#.*/, '').trim();
    console.log(`varibale: `, { lineWithoutComment, comment })
    return { lineWithoutComment, comment }; // 返回一个对象
}


function GetLineNoCommentResult(inpLine: string) {
    let result = '';
    if (inpLine.includes('x') && inpLine.includes('=')) {
        try { // 尝试解方程
            result = solveEquation(inpLine);
            result = `x = ${result}`
        } catch (error) {
            console.log(`error: `, error)
            //如果solveEquation内部出错, 也不影响下面逻辑执行
            result = `${inpLine}  # 方程求解失败, 请检查方程的格式`;
        }
        return result
    }

    try {
        const needPercent = inpLine.includes('/') ? true : false
        const evalResult = evaluate(inpLine);
        const formattedResult = formatEvalResult(evalResult, needPercent);
        result = `${inpLine} = ${formattedResult}`;
    } catch (error: any) {
        console.log(`error: `, error)
        result = `${inpLine}`; //如果发生异常 还是显示原始行
    }
    return result
}




/** 输入一个一元一次方程 x表示需要求解的变量 */
function solveEquation(equation: string): string {
    // 将方程以"="拆分为左右两部分
    const parts = equation.split('=');
    if (parts.length !== 2) {
        throw new Error("方程格式不正确，应为 '表达式=表达式'");
    }
    const [left, right] = parts;

    // 定义函数 f(x) = 左边表达式 - 右边表达式
    const f = (x: number): number => {
        // 使用 Function 构造器生成计算表达式的函数
        const leftFunc = new Function("x", "return " + left);
        const rightFunc = new Function("x", "return " + right);
        return leftFunc(x) - rightFunc(x);
    };

    // 计算 f(0) 和 f(1)
    const f0 = f(0);
    const f1 = f(1);
    const coeff = f1 - f0; // 线性函数 f(x) = f0 + coeff * x

    // 如果系数为0，则需要判断是否有无穷多解或无解
    if (coeff === 0) {
        if (f0 === 0) return "Infinite solutions"; // 无穷多解
        else return "No solution"; // 无解
    }

    // 求解 f(x) = 0 => x = -f(0) / coeff
    const result = -f0 / coeff;
    // 如果结果是小数，保留4位小数
    const resultStr = result.toString();

    // 如果存在小数点，且小数位数大于4位，则格式化为保留4位小数
    if (resultStr.includes('.')) {
        const fractionalPart = resultStr.split('.')[1];
        if (fractionalPart.length > 4) {
            return result.toFixed(4);
        }
    }
    return resultStr;
}



