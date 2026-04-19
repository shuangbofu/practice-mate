import json
import re
import os

def parse_markdown_qa(file_path):
    """解析大模型基础理论.md，提取有答案的问答"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    # 匹配 #### Qxx: 问题 ...
    pattern = r'#### (Q\d+:.*?)(?=#### Q\d+:|$)'
    matches = re.findall(pattern, content, re.DOTALL)
    
    for i, block in enumerate(matches):
        # 分离问题和内容
        q_match = re.match(r'Q\d+:(.*?)\n', block)
        if not q_match:
            continue
            
        q_text = q_match.group(1).strip()
        # 剩余部分作为答案候选
        answer_candidate = block[q_match.end():].strip()
        
        # 过滤条件：必须包含“回答要点”、“标准答案”或“核心考点”之一
        if any(keyword in answer_candidate for keyword in ["回答要点", "标准答案", "核心考点"]):
            questions.append({
                "id": i + 1,
                "question": q_text,
                "answer": answer_candidate
            })
    
    return questions

def parse_chat_txt(file_path):
    """解析 rag开发.txt 和 agent开发.txt"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    # 匹配 ## user 和 ## assistant 块
    user_blocks = re.findall(r'## user\n(.*?)\n## assistant', content, re.DOTALL)
    assistant_blocks = re.findall(r'## assistant\n(.*?)(?=\n## user|$)', content, re.DOTALL)
    
    for i, (u, a) in enumerate(zip(user_blocks, assistant_blocks)):
        questions.append({
            "id": i + 1,
            "question": u.strip(),
            "answer": a.strip()
        })
        
    return questions

def create_module(topic_name, questions, start_id=100):
    """创建符合 result.json 结构的模块"""
    # 简单地将所有问题放在一个分类下，或者根据问题内容进一步分类
    # 这里为了简单，先放在一个通用分类下，或者尝试根据问题关键词分类
    # 考虑到用户要求“分成三个模块”，我们可以每个文件一个大模块
    
    module = {
        "id": start_id,
        "topicName": topic_name,
        "categories": [
            {
                "id": start_id + 1,
                "categoryName": "核心知识点",
                "questions": questions
            }
        ]
    }
    return module

def main():
    base_dir = r'd:\program_github\practice-mate\public'
    result_json_path = os.path.join(base_dir, 'result.json')
    
    # 1. 读取现有数据
    with open(result_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 清理可能存在的旧模块，防止重复添加
    topics_to_remove = ["AI 大模型与 Agent 开发", "大模型基础理论", "RAG 开发实战", "Agent 开发实战"]
    data = [item for item in data if item.get('topicName') not in topics_to_remove]
    
    current_max_id = max([item.get('id', 0) for item in data]) if data else 0
    
    all_questions = []
    q_id_counter = 1
    
    # 2. 处理大模型基础理论
    md_path = os.path.join(base_dir, '大模型基础理论.md')
    md_questions = parse_markdown_qa(md_path)
    for q in md_questions:
        q['id'] = q_id_counter
        q_id_counter += 1
        all_questions.append(q)
    print(f"提取大模型理论问答: {len(md_questions)} 条")
    
    # 3. 处理 RAG 开发
    rag_path = os.path.join(base_dir, 'rag开发-20260405153109.txt')
    rag_questions = parse_chat_txt(rag_path)
    for q in rag_questions:
        q['id'] = q_id_counter
        q_id_counter += 1
        all_questions.append(q)
    print(f"提取 RAG 开发问答: {len(rag_questions)} 条")
        
    # 4. 处理 Agent 开发
    agent_path = os.path.join(base_dir, 'agent开发-20260405201455.txt')
    agent_questions = parse_chat_txt(agent_path)
    for q in agent_questions:
        q['id'] = q_id_counter
        q_id_counter += 1
        all_questions.append(q)
    print(f"提取 Agent 开发问答: {len(agent_questions)} 条")
    
    # 5. 创建合并后的模块（包含三个分类）
    if all_questions:
        # 重新分配 ID，确保每个分类下的问题 ID 从 1 开始连续
        md_qs = all_questions[:len(md_questions)]
        rag_qs = all_questions[len(md_questions):len(md_questions)+len(rag_questions)]
        agent_qs = all_questions[len(md_questions)+len(rag_questions):]
        
        for i, q in enumerate(md_qs): q['id'] = i + 1
        for i, q in enumerate(rag_qs): q['id'] = i + 1
        for i, q in enumerate(agent_qs): q['id'] = i + 1

        merged_module = {
            "id": current_max_id + 1,
            "topicName": "AI 大模型与 Agent 开发",
            "categories": [
                {
                    "id": 1,
                    "categoryName": "大模型基础理论",
                    "questions": md_qs
                },
                {
                    "id": 2,
                    "categoryName": "RAG 开发实战",
                    "questions": rag_qs
                },
                {
                    "id": 3,
                    "categoryName": "Agent 开发实战",
                    "questions": agent_qs
                }
            ]
        }
        data.append(merged_module)
        
    # 6. 写回文件
    with open(result_json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"\n合并完成！共新增 {len(all_questions)} 条问答。")

if __name__ == '__main__':
    main()
