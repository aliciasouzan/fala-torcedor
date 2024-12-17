import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

async function getTimes() {
const { data } = await axios.get("http://localhost:3000/times", {params : { torcedores: "y"}});
    // console.log("Dados recebidos do backend:", data);
    return data;
}

async function createTime(nome: string, dataFundacao: string) {
    await axios.post("http://localhost:3000/times", {
        nome,
        data_fundacao: dataFundacao,
    });
}

async function updateTime(id: number, nome: string, dataFundacao: string) {
    await axios.put(`http://localhost:3000/times/${id}`, {
        nome,
        data_fundacao: dataFundacao,
    });
}

async function deleteTime(id: number) {
    await axios.delete(`http://localhost:3000/times/${id}`);
}

function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
}

function Times() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [nome, setNome] = useState("");
    const [dataFundacao, setDataFundacao] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const times = useQuery({queryKey: ["times"], queryFn: getTimes});

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await createTime(nome, dataFundacao);
            setIsModalOpen(false);
            setNome("");
            setDataFundacao("");
            times.refetch();
        } catch (error) {
            console.error("Erro ao criar time:", error);
        }
    };

    const handleEditSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (editId !== null) {
            try {
                await updateTime(editId, nome, dataFundacao);
                setIsEditModalOpen(false);
                setNome("");
                setDataFundacao("");
                setEditId(null);
                times.refetch();
            } catch (error) {
                console.error("Erro ao editar time:", error);
            }
        }
    };

    const handleEditClick = (time: { id: number; nome: string; data_fundacao: string }) => {
        setEditId(time.id);
        setNome(time.nome);
        setDataFundacao(time.data_fundacao);
        setIsEditModalOpen(true);
    };

    const handleDeleteSubmit = async () => {
        if (deleteId !== null) {
            try {
                await deleteTime(deleteId);
                setIsDeleteModalOpen(false);
                setDeleteId(null);
                times.refetch();
            } catch (error) {
                console.error("Erro ao deletar time:", error);
            }
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };


    if (times.isError) {
        return <div>Erro ao carregar os times</div>;
    }

    return (
        <div>
            <h2>Times</h2>
            <button>
                <Link to="/">Voltar</Link>
            </button>
            <button onClick={() => setIsModalOpen(true)}>
                Criar
            </button>

            {times.isLoading ? (<div>Carregando...</div>) : (
                <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data de fundação</th>
                        <th>Quantidade de torcedores</th>
                        <th>Ações</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {times.data.map((time) => (
                        <tr key={time.id}>
                            <td>{time.nome}</td>
                            <td>{formatDate(time.data_fundacao)}</td>
                            <td>{time.torcedores}</td>
                            <td><button onClick={() => handleEditClick(time)}>Editar</button></td>
                            <td><button onClick={() => handleDeleteClick(time.id)}>Deletar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Criar Time</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Data de Fundação:</label>
                                <input
                                    type="date"
                                    value={dataFundacao}
                                    onChange={(e) => setDataFundacao(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Criar</button>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsEditModalOpen(false)}>&times;</span>
                        <h2>Editar Time</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div>
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Data de Fundação:</label>
                                <input
                                    type="date"
                                    value={dataFundacao}
                                    onChange={(e) => setDataFundacao(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Salvar</button>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsDeleteModalOpen(false)}>&times;</span>
                        <h2>Deseja deletar?</h2>
                        <p>Tem certeza que deseja deletar este time?</p>
                        <button onClick={handleDeleteSubmit}>Sim</button>
                        <button onClick={() => setIsDeleteModalOpen(false)}>Não</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Times;