import { Hino } from "./Hino";
import { Ocorrencia } from "./Ocorrencia";

export class Pessoa {
    constructor() {}
    id!: number;
    userName!: string;
    password!: string;
    nome!: string;
    apelidoInstrutor!: string;
    apelidoEncarregado!: string;
    apelidoEncRegional!: string;
    regiao!: string;
    regional!: string;
    celular!: string;
    email!: string;
    dataNascimento!: string;
    dataInicio!: string;
    comum!: string;
    instrumento!: string;
    condicao!: string;
    ocorrencias!: Ocorrencia[];
    hinos!: Hino[];
}
