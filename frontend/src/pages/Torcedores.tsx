import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

async function getTorcedores() {
    const { data } = await axios.get("http://localhost:3000/torcedores");
    return data;
}

async function getTimes() {
    const { data } = await axios.get("http://localhost:3000/times");
    return data;
}

async function createTorcedor(nome: string, dataNascimento: string, timeFavoritoId: number) {
    await axios.post("http://localhost:3000/torcedores", {
        nome,
        data_nascimento: dataNascimento,
        time_favorito: timeFavoritoId,
    });
}

async function updateTorcedor(id: number, nome: string, dataNascimento: string, timeFavoritoId: number) {
    await axios.put(`http://localhost:3000/torcedores/${id}`, {
        nome,
        data_nascimento: dataNascimento,
        time_favorito: timeFavoritoId,
    });
}

async function deleteTorcedor(id: number) {
    await axios.delete(`http://localhost:3000/torcedores/${id}`);
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
}

function Torcedores() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [timeFavorito, setTimeFavorito] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const torcedores = useQuery({ queryKey: ["torcedores"], queryFn: getTorcedores });
    const times = useQuery({ queryKey: ["times"], queryFn: getTimes });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const timeFavoritoId = times.data.find((time: any) => time.nome === timeFavorito)?.id;
        if (timeFavoritoId) {
            try {
                await createTorcedor(nome, dataNascimento, timeFavoritoId);
                setIsModalOpen(false);
                setNome("");
                setDataNascimento("");
                setTimeFavorito("");
                torcedores.refetch();
            } catch (error) {
                console.error("Erro ao criar torcedor:", error);
            }
        } else {
            console.error("Time favorito não encontrado");
        }
    };

    const handleEditSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const timeFavoritoId = times.data.find((time: any) => time.nome === timeFavorito)?.id;
        if (editId !== null && timeFavoritoId) {
            try {
                await updateTorcedor(editId, nome, dataNascimento, timeFavoritoId);
                setIsEditModalOpen(false);
                setNome("");
                setDataNascimento("");
                setTimeFavorito("");
                setEditId(null);
                torcedores.refetch();
            } catch (error) {
                console.error("Erro ao editar torcedor:", error);
            }
        } else {
            console.error("Time favorito não encontrado");
        }
    };

    const handleDeleteSubmit = async () => {
        if (deleteId !== null) {
            try {
                await deleteTorcedor(deleteId);
                setIsDeleteModalOpen(false);
                setDeleteId(null);
                torcedores.refetch();
            } catch (error) {
                console.error("Erro ao deletar torcedor:", error);
            }
        }
    };

    const handleEditClick = (torcedor: { id: number; nome: string; data_nascimento: string; time_favorito: string }) => {
        setEditId(torcedor.id);
        setNome(torcedor.nome);
        setDataNascimento(torcedor.data_nascimento);
        setTimeFavorito(torcedor.time_favorito);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    if (torcedores.isError || times.isError) {
        return <div>Erro ao carregar os dados</div>;
    }

    return (
        <div>
            <h2>Torcedores</h2>
            <button>
                <Link to="/">Voltar</Link>
            </button>
            <button onClick={() => setIsModalOpen(true)}>
                Criar
            </button>

            {torcedores.isLoading || times.isLoading ? (<div>Carregando...</div>) : (
                <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data de Nascimento</th>
                        <th>Time Favorito</th>
                        <th>Ações</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {torcedores.data.map((torcedor: any) => (
                        <tr key={torcedor.id}>
                            <td>{torcedor.nome}</td>
                            <td>{formatDate(torcedor.data_nascimento)}</td>
                            <td>{torcedor.time_favorito}</td>
                            <td><button onClick={() => handleEditClick(torcedor)}>Editar</button></td>
                            <td><button onClick={() => handleDeleteClick(torcedor.id)}>Deletar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Criar Torcedor</h2>
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
                                <label>Data de Nascimento:</label>
                                <input
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(e) => setDataNascimento(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Time Favorito:</label>
                                <select
                                    value={timeFavorito}
                                    onChange={(e) => setTimeFavorito(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione um time</option>
                                    {times.data.map((time: any) => (
                                        <option key={time.id} value={time.nome}>{time.nome}</option>
                                    ))}
                                </select>
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
                        <h2>Editar Torcedor</h2>
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
                                <label>Data de Nascimento:</label>
                                <input
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(e) => setDataNascimento(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Time Favorito:</label>
                                <select
                                    value={timeFavorito}
                                    onChange={(e) => setTimeFavorito(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione um time</option>
                                    {times.data.map((time: any) => (
                                        <option key={time.id} value={time.nome}>{time.nome}</option>
                                    ))}
                                </select>
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
                        <p>Tem certeza que deseja deletar este torcedor?</p>
                        <button onClick={handleDeleteSubmit}>Sim</button>
                        <button onClick={() => setIsDeleteModalOpen(false)}>Não</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Torcedores;