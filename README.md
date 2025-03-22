# Text-Based Calculator with Equation Solver

This project is a simple text-based calculator application built with React, TypeScript, Vite, pnpm, Tailwind CSS, and Shadcn UI.  It allows users to perform calculations and solve linear equations by entering expressions in a textarea.

## Features

*   **Basic Arithmetic:**  Performs addition, subtraction, multiplication, division, and other standard mathematical operations.
*   **Equation Solving:** Solves linear equations with a single variable 'x'.
*   **Comment Support:**  Allows users to add comments to their calculations using the `#` symbol.  The part of the line after `#` will be treated as a comment and ignored during calculation.
*   **Error Handling:**  Provides informative error messages if the input is invalid or the equation cannot be solved.
*   **Responsive Design:**  Adapts to different screen sizes using a two-column layout.
*   **Formatted Output** Displays numbers in a user friendly way. Format the output, show percentage if the value is too small.

## Tech Stack

*   **Frontend Framework:** [React](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Package Manager:** [pnpm](https://pnpm.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Math Library:** [Math.js](https://mathjs.org/)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    This will start the development server, typically on `http://localhost:3000`.  Open this URL in your browser to see the application.

## Usage

1.  **Enter calculations:** Type mathematical expressions into the left textarea.  Each line is treated as a separate calculation.
2.  **Add comments:** Use the `#` symbol to add comments to your calculations.  For example: `2 * 3 + 4 # This is a comment`.
3.  **Solve equations:** Enter linear equations with 'x' as the variable.  For example: `2x + 5 = 11`.
4.  **View results:** The results will be displayed in the right textarea.  If an error occurs, an error message will be shown.

## Examples

3+29
5/2
2*(3+5) # calculate first
x+2=5
3x - 1 = 2x + 4 # Solve for x




## Contributing

Contributions are welcome!  If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE) (You'll need to create a LICENSE file with the MIT license text).

---

<details>
<summary>中文说明 (Chinese Version)</summary>

# 基于文本的计算器（带方程求解）

基于文本的计算器应用，一个静态前端项目

允许用户通过在文本区域中输入表达式来求计算结果，支持一元一次方程。

项目使用 React、TypeScript、Vite、pnpm、Tailwind CSS 和 Shadcn UI 构建。

支持pwa离线安装到不同的OS


## 功能特性

*   **基础算术：** 执行加法、减法、乘法、除法和其他标准数学运算。
*   **方程求解：** 求解具有单个变量 'x' 的线性方程。
*   **注释支持：** 允许用户使用 `#` 符号向其计算添加注释。 `#` 后面的部分将被视为注释，并在计算过程中被忽略。
*   **响应式设计：** 使用两列布局适应不同的屏幕尺寸。
*   **格式化输出：** 以用户友好的方式显示数字。格式化输出， 如果值太小，就显示百分比。
*   **PWA支持** 使用Https部署后可以通过PWA安装到本地应用

## 技术栈

*   **前端框架:** [React](https://react.dev/)
*   **语言:** [TypeScript](https://www.typescriptlang.org/)
*   **构建工具:** [Vite](https://vitejs.dev/)
*   **包管理器:** [pnpm](https://pnpm.io/)
*   **样式:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI 组件:** [Shadcn UI](https://ui.shadcn.com/)
*   **数学库:** [Math.js](https://mathjs.org/)

## 快速开始

1.  **克隆仓库:**

    ```bash
    git clone <你的仓库地址>
    cd <你的仓库名称>
    ```

2.  **安装依赖:**

    ```bash
    pnpm install
    ```

3.  **运行开发服务器:**

    ```bash
    pnpm dev
    ```

    这将启动开发服务器，通常在 `http://localhost:3000` 上。在浏览器中打开此 URL 以查看应用程序。


## 例子


## 贡献

欢迎Fork/ Star

如果您发现任何错误或有改进建议，请提交一个 issue 或 pull request。

## 许可证

本项目根据 [MIT 许可证](LICENSE) 获得许可 (您需要创建一个包含 MIT 许可证文本的 LICENSE 文件)。

</details>
