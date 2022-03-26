export interface EtPointOption {
    points: number;
    comment: string;
    text: string;
}

export const POINTS_ARRAY = [
    {
        id: "1",
        caption: "К1 - Решение коммуникативной задачи",
        enabled: true,
        options: [
            {
                points: 0,
                comment: "Задание не выполнено:",
                text: "все случаи, не указанные в оценивании на 1, 2 и 3 балла, ИЛИ ответ не соответствует требуемому объёму, ИЛИ более 30% ответа имеет непродуктивный характер (т.е. текстуально совпадает с опубликованным источником)",
            },
            {
                points: 1,
                comment: "Задание выполнено не полностью:",
                text: "1 аспект не раскрыт, и 2–3 раскрыты неполно/неточно, ИЛИ 2 аспекта не раскрыты (остальные раскрыты полно), ИЛИ 2 аспекта содержания не раскрыты и 1 раскрыт неполно/неточно, ИЛИ 4–5 аспектов раскрыты неполно/неточно; имеются ошибки в стилевом оформлении речи (допускаются 4 нарушения нейтрального стиля)",
            },
            {
                points: 2,
                comment: "Задание выполнено в основном:",
                text: "1 аспект не раскрыт (остальные раскрыты полно), ИЛИ 1 аспект не раскрыт, и 1 раскрыт неполно/неточно ИЛИ 2–3 аспекта раскрыты неполно/неточно; стилевое оформление речи в основном правильно (допускаются 2–3 нарушения нейтрального стиля)",
            },
            {
                points: 3,
                comment: "Задание выполнено полностью:",
                text: "содержание отражает полно и точно все аспекты, указанные в задании; стилевое оформление речи выбрано правильно (допускается 1 неполный/неточный аспект и 1 нарушение нейтрального стиля)",
            }
        ]
    },
    {
        id: "2",
        caption: "К2 - Организация текста",
        enabled: true,
        options: [
            {
                points: 0,
                comment: "",
                text: "В высказывании имеются 6 и более ошибок в организации текста, И/ИЛИ отсутствует вступление и заключение, И/ИЛИ предложенный план ответа полностью не соблюдается, И/ИЛИ отсутствует деление на абзацы",
            },
            {
                points: 1,
                comment: "",
                text: "В высказывании имеются 4–5 ошибок в организации текста И/ИЛИ отсутствует вступление или заключение",
            },
            {
                points: 2,
                comment: "",
                text: "Высказывание логично, структура текста соответствует предложенному плану, текст правильно разделён на абзацы, средства логической связи использованы (допускается 1–3 ошибки)",
            },
            {
                points: 3,
                comment: "",
                text: "Высказывание логично, структура текста соответствует предложенному плану, текст правильно разделён на абзацы, средства логической связи использованы правильно",
            }
        ]
    },
    {
        id: "3",
        caption: "К3 - Лексика",
        enabled: true,
        options: [
            {
                points: 0,
                comment: "",
                text: "Используемый словарный запас не соответствует высокому уровню сложности задания, в тексте имеются 5 и более лексических ошибок",
            },
            {
                points: 1,
                comment: "",
                text: "Используемый словарный запас не вполне соответствует высокому уровню сложности задания, в тексте имеются 4 лексические ошибки",
            },
            {
                points: 2,
                comment: "",
                text: "Используемый словарный запас соответствует высокому уровню сложности задания, однако имеются 2–3 лексические ошибки, ИЛИ словарный запас ограничен, но лексика использована правильно",
            },
            {
                points: 3,
                comment: "",
                text: "Используемый словарный запас соответствует высокому уровню сложности задания, практически нет нарушений в использовании лексики (допускается 1 лексическая ошибка)",
            }
        ]
    },
    {
        id: "4",
        caption: "К4 - Грамматика",
        enabled: true,
        options: [
            {
                points: 0,
                comment: "",
                text: "Используемые грамматические средства не соответствуют высокому уровню сложности задания, имеются 8 и более грамматических ошибок",
            },
            {
                points: 1,
                comment: "",
                text: "Используемые грамматические средства не вполне соответствуют высокому уровню сложности задания, в тексте имеются 5–7 грамматических ошибок",
            },
            {
                points: 2,
                comment: "",
                text: "Используемые грамматические средства соответствуют высокому уровню сложности задания, однако в тексте имеются 3–4 грамматические ошибки",
            },
            {
                points: 3,
                comment: "",
                text: "Используемые грамматические средства соответствуют высокому уровню сложности задания, нарушений практически нет (допускаются 1–2 не повторяющиеся грамматические ошибки)",
            }
        ]
    },
    {
        id: "5",
        caption: "К5 - Орфография и пунктуация",
        enabled: true,
        options: [
            {
                points: 0,
                comment: "",
                text: "В тексте имеются 5 и более орфографических И/ИЛИ пунктуационных ошибок",
            },
            {
                points: 1,
                comment: "",
                text: "В тексте имеются 2–4 орфографические И/ИЛИ пунктуационные ошибки",
            },
            {
                points: 2,
                comment: "",
                text: "Орфографические ошибки практически отсутствуют. Текст разделён на предложения с правильным пунктуационным оформлением (допускается 1 орфографическая И/ИЛИ 1 пунктуационная ошибка)",
            }
        ]
    },
];

export const POINTS_RESULT = [-1, -1, -1, -1, -1];

export const UNITS_CONST = [
    {color: "#fff8f8", name: "Введение", id: "intro"},
    {color: "#efffef", name: "Своя точка зрения", id: "one"},
    {color: "#fff8ff", name: "Противоположная точка зрения", id: "two"},
    {color: "#edf7ff", name: "Контраргумент", id: "three"},
    {color: "#fffff1", name: "Заключение", id: "final"},
];