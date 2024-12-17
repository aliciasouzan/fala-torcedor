import { query } from '../config/db.js';

export const createTorcedor = async (nome, data_nascimento, time_favorito) => {
    const res = await query(
        'INSERT INTO torcedores (nome, data_nascimento, time_favorito) VALUES ($1, $2, $3) RETURNING *',
        [nome, data_nascimento, time_favorito]
    );
    return res.rows;
};

export const getAllTorcedores = async () => {
    const res = await query('SELECT torcedores.id, torcedores.nome, torcedores.data_nascimento, times.nome AS time_favorito FROM public.torcedores LEFT JOIN public.times ON torcedores.time_favorito = times.id ORDER BY torcedores.id');
    console.log(res.rows);
    return res.rows;
};

export const updateTorcedor = async (id, nome, data_nascimento, time_favorito) => {
    const fields = [];
    const values = [];
    let queryText = 'UPDATE torcedores SET ';

    if (nome) {
        fields.push('nome = $' + (fields.length + 1));
        values.push(nome);
    }

    if (data_nascimento) {
        fields.push('data_nascimento = $' + (fields.length + 1));
        values.push(data_nascimento);
    }

    if (time_favorito) {
        fields.push('time_favorito = $' + (fields.length + 1));
        values.push(time_favorito);
    }

    if (fields.length === 0) {
        throw new Error('Pelo menos um campo deve ser fornecido para atualização.');
    }

    queryText += fields.join(', ') + ' WHERE id = $' + (fields.length + 1) + ' RETURNING *';
    values.push(id);

    // console.log('Query:', queryText);
    // console.log('Values:', values);

    const res = await query(queryText, values);
    return res.rows;
};

export const deleteTorcedor = async (id) => {
    const res = await query('DELETE FROM torcedores WHERE id = $1 RETURNING *', [id]);
    return res.rows;
};