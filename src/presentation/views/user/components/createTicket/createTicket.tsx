import { useEffect, useMemo, useState } from 'react';
import styles from './style/Style.module.css';
import type { User } from '@/domain/entities/user/User';
import ApiTicketRepository from '@/data/repositories/ticket/remote/ApiTicketRepository';
import { ApiLocationRepository, type Region, type City } from '@/data/repositories/location/ApiLocationRepository';

interface CreateTicketProps {
    user: User;
};

const CreateTicket = ({ user }: CreateTicketProps) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [regions, setRegions] = useState<Region[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
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
        const loadRegions = async () => {
            try {
                const response = await locationRepository.getRegions();
                console.log('Loaded regions:', response);
                const regionsData = Array.isArray(response) ? response : [];
                setRegions(regionsData);
            } catch (e) {
                console.error("Не удалось загрузить регионы", e);
                setRegions([]);
            }
        };
        void loadRegions();
    }, [locationRepository]);

    useEffect(() => {
        const loadCities = async () => {
            if (selectedRegionId) {
                try {
                    const allCities = await locationRepository.getCities(selectedRegionId);
                    setCities(allCities);
                    setSelectedCityId(null);
                } catch (e) {
                    console.error("Не удалось загрузить города", e);
                }
            } else {
                setCities([]);
            }
        };
        void loadCities();
    }, [selectedRegionId, locationRepository]);

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const api = new ApiTicketRepository();

            await api.createTicket(user, {
                title,
                description,
                cityId: selectedCityId!,
            });
            setSuccess(true);
            setTitle('');
            setDescription('');
            setSelectedRegionId(null);
            setSelectedCityId(null);
            setCities([]);
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
                <p className={styles.label_text}>Регион</p>
                <select
                    className={styles.input}
                    value={selectedRegionId ?? ''}
                    onChange={(e) =>
                        setSelectedRegionId(e.target.value ? Number(e.target.value) : null)
                    }
                >
                    <option value="">Выберите регион...</option>
                    {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                            {region.name}
                        </option>
                    ))}
                </select>
            </label>

            {selectedRegionId && cities.length > 0 && (
                <label className={styles.label}>
                    <p className={styles.label_text}>Город</p>
                    <select
                        className={styles.input}
                        value={selectedCityId ?? ''}
                        onChange={(e) =>
                            setSelectedCityId(e.target.value ? Number(e.target.value) : null)
                        }
                    >
                        <option value="">Выберите город...</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </label>
            )}

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
