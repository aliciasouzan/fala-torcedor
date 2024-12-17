import { query } from '../config/db.js';

export const createTime = async (nome, data_fundacao) => {
    const res = await query(
        'INSERT INTO times (nome, data_fundacao) VALUES ($1, $2) RETURNING *',
        [nome, data_fundacao]
    );
    return res.rows;
};

export const getTimes = async (filter) => {
    if (filter.torcedores == "y") {
        const res = await query('SELECT times.*, COUNT(torcedores.id) AS torcedores FROM times LEFT JOIN torcedores ON times.id = torcedores.time_favorito GROUP BY times.id ORDER BY times.id');
        return res.rows;
    }
    const res = await query('SELECT * FROM times ORDER BY id');
    return res.rows;
};

export const updateTime = async (id, nome, data_fundacao) => {
    const fields = [];
    const values = [];
    let queryText = 'UPDATE times SET ';

    if (nome) {
        fields.push('nome = $' + (fields.length + 1));
        values.push(nome);
    }
    if (data_fundacao) {
        fields.push('data_fundacao = $' + (fields.length + 1));
        values.push(data_fundacao);
    }

    if (fields.length === 0) {
        throw new Error('Pelo menos um campo deve ser fornecido para atualização.');
    }

    queryText += fields.join(', ') + ' WHERE id = $' + (fields.length + 1) + ' RETURNING *';
    values.push(id);

    const res = await query(queryText, values);
    return res.rows;
};

export const deleteTime = async (id) => {
    const res = await query('DELETE FROM times WHERE id = $1 RETURNING *', [id]);
    return res.rows;
};