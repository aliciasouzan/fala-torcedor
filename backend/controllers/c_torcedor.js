import { getAllTorcedores, createTorcedor as createTorcedorModel, updateTorcedor as updateTorcedorModel, deleteTorcedor as deleteTorcedorModel } from '../models/m_torcedor.js';

export const createTorcedor = async (req, res) => {
    const { nome, data_nascimento, time_favorito } = req.body;

    if (!nome || !data_nascimento) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const result = await createTorcedorModel(nome, data_nascimento, time_favorito);
        return res.status(201).json(result[0]);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao criar torcedor!' });
    }
};

export const getTorcedores = async (req, res) => {
    try {
        const torcedores = await getAllTorcedores();
        return res.status(200).json(torcedores);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Erro ao obter torcedores!' });
    }
};

export const updateTorcedor = async (req, res) => {
    const { id } = req.params;
    const { nome, data_nascimento, time_favorito } = req.body;

    if (!nome && !data_nascimento && !time_favorito) {
        return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    try {
        const result = await updateTorcedorModel(id, nome, data_nascimento, time_favorito);
        return res.status(200).json({
            message: 'Torcedor atualizado com sucesso!',
            torcedor: result[0]
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Erro ao atualizar torcedor!'
        });
    }
};

export const deleteTorcedor = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteTorcedorModel(id);
        return res.status(200).json({
            message: 'Torcedor excluído com sucesso!'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Erro ao excluir torcedor!'
        });
    }
}