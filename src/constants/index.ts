import { PractiseMode } from "../types";

export const DATA_PATH =
	'http://124.220.5.206//data/interviewQuestionBank/data.json'

export const COLORS = [
	"#EF4444", // 红色
	"#F43F5E", // 玫瑰红（偏红）
	"#FF6F61", // 浅珊瑚红（偏红）

	"#F59E0B", // 橙色
	"#F4C025", // 黄色

	"#10B459", // 绿色
	"#4AD18E", // 青绿色（偏青）


	"#2998FF", // 蓝色
	"#06B6D4", // 青色

	"#6B21D6", // 紫色
	"#8B5CF6", // 深紫色
	"#C084FC", // 浅紫色

	"#E91E63", // 粉色（可视为红紫之间）

];

export const DARK_COLORS = [
	"#9B363E", // 深红色
	"#C23664", // 深玫瑰红
	"#C75A52", // 深浅珊瑚红

	"#B28E09", // 深橙色
	"#B19704", // 深黄色

	"#059B8D", // 深绿色
	"#068E81", // 深青绿色

	"#1D72B8", // 深蓝色
	"#0596C8", // 深青色

	"#5A189A", // 深紫色
	"#6A008F", // 深深紫色
	"#A066C2", // 深浅紫色

	"#C2185B"  // 深粉色
];

export const PRACTISE_MODE_LABEL: Record<PractiseMode, string> = {
	practise: '练习',
	learn: '学习'
}