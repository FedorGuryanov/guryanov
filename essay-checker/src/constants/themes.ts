export interface EtThemeOption {
    id: string;
    text: string;
}

export const THEMES_ARRAY: EtThemeOption[] = [{
    id: '',
    text: 'Без темы'
}, {
    id: 'sdfdsf432jhjh',
    text: 'What book genres are popular among teenagers'
}, {
    id: 'mmnvvkkl2432',
    text: 'What people use their smartphones for'
}, {
    id: 'klkooooo3',
    text: 'What things teenagers collect'
}, {
    id: 'zzzokkfjsdl32',
    text: 'How teenagers get pocket money'
}, {
    id: 'f323237lklklklpo',
    text: 'What foreign language people would like to learn apart from English'
}];

export const THEMES_TEXT_MAP: { [key: string]: { start: string, end: string } } = {
    'sdfdsf432jhjh': {
        start: 'Imagine that you are doing a project on <b>what book genres are popular among teenagers in Zetland</b>. You have found some data on the subject – the results of the opinion polls (see the table below).<br/><b>Comment on the data in the table and give your opinion on the subject of the project</b>.',
        end: `<b>Write 200—250 words.</b><br/>Use the following plan:<br/>
— make an opening statement on the subject of the project;<br/>
— select and report 2—3 facts;<br/>
— make 1—2 comparisons where relevant;<br/>
— outline a problem that can arise with reading and suggest a way of solving it;<br/>
— conclude by giving your opinion on the importance of reading for teenagers.
`
    },
    'mmnvvkkl2432': {
        start: 'Imagine that you are doing a project on <b>what people use their smartphones for in Zetland</b>. You have found some data on the subject – the results of the opinion polls (see the diagram below).<br/><b>Comment on the data in the diagram and give your opinion on the subject of the project</b>.',
        end: `<b>Write 200—250 words.</b><br/>Use the following plan:<br/>
— make an opening statement on the subject of the project;<br/>
— select and report 2—3 facts;<br/>
— make 1—2 comparisons where relevant;<br/>
— outline a problem that can arise with smartphones and suggest a way of solving it;<br/>
— conclude by giving your opinion on the role of smartphones in our life.
`
    },
    'klkooooo3': {
        start: 'Imagine that you are doing a project on <b>what things teenagers collect in Zetland</b>. You have found some data on the subject – the results of the opinion polls (see the table below).<br/><b>Comment on the data in the table and give your opinion on the subject of the project</b>.',
        end: `<b>Write 200—250 words.</b><br/>Use the following plan:<br/>
— make an opening statement on the subject of the project;<br/>
— select and report 2—3 facts;<br/>
— make 1—2 comparisons where relevant;<br/>
— outline a problem that can arise with collecting and suggest a way of solving it;<br/>
— conclude by giving your opinion on the importance of collecting for teenagers.
`
    },
    'zzzokkfjsdl32': {
        start: 'Imagine that you are doing a project on <b>how teenagers get pocket money in Zetland</b>. You have found some data on the subject – the results of the opinion polls (see the diagram below).<br/><b>Comment on the data in the diagram and give your opinion on the subject of the project</b>.',
        end: `<b>Write 200—250 words.</b><br/>Use the following plan:<br/>
— make an opening statement on the subject of the project;<br/>
— select and report 2—3 facts;<br/>
— make 1—2 comparisons where relevant;<br/>
— outline a problem that can arise with getting money and suggest a way of solving it;<br/>
— conclude by giving your opinion on the role of money for teenagers.
`
    },
    'f323237lklklklpo': {
        start: 'Imagine that you are doing a project on <b>what foreign language people in Zetland would like to learn apart from English</b>. You have found some data on the subject – the results of the opinion polls (see the diagram below).<br/><b>Comment on the data in the table and give your opinion on the subject of the project</b>.',
        end: `<b>Write 200—250 words.</b><br/>Use the following plan:<br/>
— make an opening statement on the subject of the project;<br/>
— select and report 2—3 facts;<br/>
— make 1—2 comparisons where relevant;<br/>
— outline a problem that can arise with learning a foreign language and suggest a way of solving it;<br/>
— conclude by giving your opinion on the role of language learning in our life.
`
    },

};
