import { createTime as createTimeModel, getTimes as getTimesModel, updateTime as updateTimeModel, deleteTime as deleteTimeModel } from '../models/m_time.js';

export const createTime = async (req, res) => {
    const { nome, data_fundacao } = req.body;

    if (!nome || !data_fundacao) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const result = await createTimeModel(nome, data_fundacao);
        return res.status(201).json(result[0]);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao criar time!' });
    }
};

export const getTimes = async (req, res) => {
    try {
        const times = await getTimesModel(req.query);
        return res.status(200).json(times);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao obter times!' });
    }
};

export const updateTime = async (req, res) => {
    const { id } = req.params;
    const { nome, data_fundacao } = req.body;

    if (!nome && !data_fundacao) {
        return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    try {
        const result = await updateTimeModel(id, nome, data_fundacao);
        return res.status(200).json({
            message: 'Time atualizado com sucesso!',
            time: result[0]
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao atualizar time!' });
    }
};

export const deleteTime = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteTimeModel(id);
        return res.status(200).json({
            message: 'Time excluído com sucesso!'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao excluir time!' });
    }
};