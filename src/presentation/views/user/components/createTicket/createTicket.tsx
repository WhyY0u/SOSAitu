import { useEffect, useMemo, useState } from 'react';
import styles from './style/Style.module.css';
import type { User } from '@/domain/entities/user/User';
import ApiTicketRepository from '@/data/repositories/ticket/remote/ApiTicketRepository';
import { ApiLocationRepository, type City } from '@/data/repositories/location/ApiLocationRepository';

interface CreateTicketProps {
    user: User;
    onTicketCreated?: (ticket: any) => void;
};

const CreateTicket = ({ user, onTicketCreated }: CreateTicketProps) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const locationRepository = useMemo(() => new ApiLocationRepository(), []);
    const ticketRepository = useMemo(() => new ApiTicketRepository(), []);

    const isFormValid =
        title.trim().length > 0 &&
        description.trim().length > 0 &&
        selectedCityId !== null;

    useEffect(() => {
        const loadCities = async () => {
            try {
                // Загружаем города только для Павлодарской области (id=15)
                const allCities = await locationRepository.getCities(15);
                setCities(allCities);
            } catch (e) {
                console.error("Не удалось загрузить города", e);
                setCities([]);
            }
        };
        void loadCities();
    }, [locationRepository]);

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const api = new ApiTicketRepository();

            const createdTicket = await api.createTicket(user, {
                title,
                description,
                cityId: selectedCityId!,
            });
            
            setSuccess(true);
            setTitle('');
            setDescription('');
            setSelectedCityId(null);
            setCities([]);
            
            // Уведомляем родительский компонент о создании тикета
            if (onTicketCreated && createdTicket) {
                onTicketCreated(createdTicket);
            }
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка при создании тикета');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.container_create_ticket}>
            <div className={styles.title_container}>
                <p className={styles.plus}>+</p>
                <p className={styles.create_ticket_label}>Создать новый тикет</p>
            </div>

            <label className={styles.label}>
                <p className={styles.label_text}>Тема обращения</p>
                <input
                    className={styles.input}
                    placeholder="Опишите кратко суть вопроса..."
                    maxLength={30}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <span className={styles.counter}>{title.length}/30</span>
            </label>

            <label className={styles.label}>
                <p className={styles.label_text}>Подробное описание</p>
                <textarea
                    className={styles.textarea}
                    placeholder="Расскажите подробнее о вашем вопросе или проблеме..."
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <span className={styles.counter}>{description.length}/1000</span>
            </label>

            <label className={styles.label}>
                <p className={styles.label_text}>Города/районы</p>
                <select
                    className={styles.input}
                    value={selectedCityId ?? ''}
                    onChange={(e) =>
                        setSelectedCityId(e.target.value ? Number(e.target.value) : null)
                    }
                >
                    <option value="">Выберите город/район...</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </label>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>Тикет успешно создан!</p>}

            <button
                className={styles.button}
                disabled={!isFormValid || loading}
                onClick={handleSubmit}
            >
                {loading ? 'Отправка...' : 'Отправить тикет'}
            </button>
        </div>
    );
};

export default CreateTicket;
