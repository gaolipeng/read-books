# 原著阅读营：悟原理，启智慧

这款小程序体现了与时俱进的教育方式，通过利用学生熟悉的技术和平台，使得阅读更加贴近学生的生活和学习习惯。总之，这款微信小程序不仅是一个简单的阅读工具，它在促进大学生阅读方面起着至关重要的作用，帮助学生在理解中国历史的同时，也增强了他们的社会责任感。

### 贡献指南（Contribution Guide）
#### 1. 外部开发者如何贡献
- **Fork 仓库**：在 GitHub/GitLab 上 Fork 本项目到你自己的账号下。  
- **创建分支**：从 `main`（或 `dev`）分支拉出新分支，分支命名建议如下：  
  - 新功能：`feature/xxx`  
  - Bug 修复：`fix/xxx`  
  - 文档：`docs/xxx`  
- **本地开发**：  
  - 安装依赖：`pip install -r requirements.txt`  
  - 进行功能开发 / Bug 修复，并确保本地测试通过：`python manage.py test`（如有）  
- **提交代码**：按下文“提交规范”编写 commit 信息并推送到你自己的远程仓库。  
- **发起 Pull Request**：在主页仓库中从你的分支发起 PR，按照“PR 描述格式”填写说明。
- **Code Review & 修改**：根据维护者的 Review 意见进行修改，直至 PR 被合并。  

---

#### 2. 代码规范（Coding Style）
- **Python 版本与风格**
  - 使用 Python 3.8+。
  - 遵循 **PEP8** 代码风格（推荐使用 `flake8` 或 `ruff` 等工具进行检查）。  
- **Django 相关约定**
  - `views.py` 中避免写过重业务逻辑，复杂逻辑封装到 `services` / `utils` / `tools` 中。  
  - `models.py` 中字段命名清晰、含义明确，不使用难以理解的缩写。  
  - `serializers.py` 中保持字段与模型一致性，避免过多业务判断。  