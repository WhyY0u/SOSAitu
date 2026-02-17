import { useEffect, useMemo, useState } from 'react';
import ApiUserRepository from '@/data/repositories/user/remote/ApiUserRepository';
import apiClient from '@/data/datasources/api/apiClient';
import styles from './style/Style.module.css';

type AdminRecord = {
    id: number;
    fullName: string;
    categories: string[];
    role: string;
    region?: string;
    city?: string;
};

type Region = {
    id: number;
    name: string;
};

type City = {
    id: number;
    name: string;
};

const fallbackCategories = [
    'ЖКХ',
    'Водоканал',
    'Здравоохранение',
    'Образование',
    'Транспорт и дороги',
    'Дороги и тротуары',
    'Общественная безопасность',
    'Экология и благоустройство',
    'Строительство и архитектура',
    'Социальная защита',
    'Миграционные вопросы',
    'Трудовые отношения',
    'Защита прав потребителей',
    'Цифровые услуги',
    'Многодетная семья',
    'Неполная семья',
    'Пенсионер',
    'Лицо с инвалидностью',
    'Малообеспеченные граждане',
    'Сирота',
    'Студент из малообеспеченной семьи',
    'Безработный',
    'Одиноко проживающий пожилой человек',
    'Беженец или кандас',
    'Жертва бытового насилия',
    'Другое',
];

const AdminManagement = () => {
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [fullName, setFullName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [admins, setAdmins] = useState<AdminRecord[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedRole, setSelectedRole] = useState<'REGION_ADMINISTRATOR' | 'CITY_ADMINISTRATOR' | 'SUPPORT'>('SUPPORT');
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const api = useMemo(() => new ApiUserRepository(), []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const categories = await api.getAllGroups();
                setAllCategories(categories.length ? categories : fallbackCategories);

                const backendAdmins = await api.getAdministrators();
                setAdmins(
                backendAdmins.map(a => ({
                    id: a.id,
                    fullName: a.user.fullName ?? '',
                    categories: a.responsible ?? [],
                    role: a.user.role ?? 'SUPPORT',
                    region: a.region?.name,
                    city: a.city?.name,
                }))
                );

                const regionsData = await apiClient.get('/owner/location/regions');
                setRegions(regionsData.data);

            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setAllCategories(fallbackCategories);
            }
        };
        loadData();
    }, [api]);

    useEffect(() => {
        if (selectedRegionId) {
            loadCities(selectedRegionId);
        } else {
            setCities([]);
            setSelectedCityId(null);
        }
    }, [selectedRegionId]);

    const loadCities = async (regionId: number) => {
        try {
            const response = await apiClient.get(`/owner/location/regions/${regionId}/cities`);
            setCities(response.data);
        } catch (e) {
            console.error('Ошибка загрузки городов:', e);
        }
    };

    const availableCategories = useMemo(() => allCategories.length ? allCategories : fallbackCategories, [allCategories]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category]
        );
    };

    const handleAddAdmin = async () => {
        const normalizedName = fullName.trim();
        if (!normalizedName || selectedCategories.length === 0) return;
        
        if (selectedRole === 'CITY_ADMINISTRATOR' && !selectedCityId) return;
        if (selectedRole === 'REGION_ADMINISTRATOR' && !selectedRegionId) return;

        try {
            const response = await api.addAdministrator({
                id: normalizedName,
                types: selectedCategories,
                regionId: selectedRegionId || undefined,
                cityId: selectedCityId || undefined,
            });

            setAdmins(prev => [
                ...prev,
                {
                    id: response.id,
                    fullName: response.user.fullName ?? '',
                    categories: response.responsible ?? [],
                    role: selectedRole,
                    region: regions.find(r => r.id === selectedRegionId)?.name,
                    city: cities.find(c => c.id === selectedCityId)?.name,
                },
            ]);

            setFullName('');
            setSelectedCategories([]);
            setSelectedRegionId(null);
            setSelectedCityId(null);
        } catch (err) {
            console.error('Ошибка при добавлении администратора:', err);
        }
    };

    const handleDeleteAdmin = async (admin: AdminRecord) => {
        try {
            await api.deleteAdministrator({
                id: admin.id.toString(),
                types: admin.categories,
            });
            setAdmins(prev => prev.filter(a => a.id !== admin.id));
        } catch (err) {
            console.error('Ошибка при удалении администратора:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBlock}>
                <p className={styles.title}>Управление администраторами</p>
                <p className={styles.subtitle}>Добавьте администратора области, города или support</p>

                <label className={styles.label}>
                    ID пользователя
                    <input
                        className={styles.input}
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Например, 99831"
                    />
                </label>

                <label className={styles.label}>
                    Роль
                    <select
                        className={styles.input}
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as 'REGION_ADMINISTRATOR' | 'CITY_ADMINISTRATOR' | 'SUPPORT')}
                    >
                        <option value="SUPPORT">Support (отвечает на обращения)</option>
                        <option value="CITY_ADMINISTRATOR">Администратор города</option>
                        <option value="REGION_ADMINISTRATOR">Администратор области</option>
                    </select>
                </label>

                {selectedRole === 'REGION_ADMINISTRATOR' && (
                    <label className={styles.label}>
                        Регион ответственности
                        <select
                            className={styles.input}
                            value={selectedRegionId ?? ''}
                            onChange={(e) => setSelectedRegionId(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">Выберите регион...</option>
                            {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </label>
                )}

                {selectedRole === 'CITY_ADMINISTRATOR' && (
                    <>
                        <label className={styles.label}>
                            Регион
                            <select
                                className={styles.input}
                                value={selectedRegionId ?? ''}
                                onChange={(e) => setSelectedRegionId(e.target.value ? Number(e.target.value) : null)}
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
                                Город
                                <select
                                    className={styles.input}
                                    value={selectedCityId ?? ''}
                                    onChange={(e) => setSelectedCityId(e.target.value ? Number(e.target.value) : null)}
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
                    </>
                )}

                <div className={styles.categoriesBlock}>
                    <p className={styles.categoriesTitle}>
                        {selectedRole === 'SUPPORT' ? 'Типы тикетов' : 'Категории ответственности'}
                    </p>
                    <div className={styles.categoriesList}>
                        {availableCategories.map((category) => (
                            <label key={category} className={styles.categoryItem}>
                                <input
                                    className={styles.categoryCheckbox}
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => toggleCategory(category)}
                                />
                                <span className={styles.categoryLabel}>{category}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    className={styles.addButton}
                    type="button"
                    onClick={handleAddAdmin}
                    disabled={
                        !fullName.trim() || 
                        selectedCategories.length === 0 || 
                        (selectedRole === 'REGION_ADMINISTRATOR' && !selectedRegionId) ||
                        (selectedRole === 'CITY_ADMINISTRATOR' && !selectedCityId)
                    }
                >
                    Добавить
                </button>
            </div>

            <div className={styles.listBlock}>
                <p className={styles.listTitle}>Список администраторов</p>
                {admins.length === 0 && (
                    <p className={styles.emptyText}>Пока нет администраторов. Добавьте первого.</p>
                )}

                {admins.map((admin) => (
                    <div key={admin.id} className={styles.adminCard}>
                        <div>
                            <p className={styles.adminName}>{admin.fullName}</p>
                            <div className={styles.adminRole}>
                                <span className={`${styles.roleBadge} ${styles[admin.role.toLowerCase()]}`}>
                                    {admin.role === 'SUPERVISOR' && '🔵 '}
                                    {admin.role === 'REGION_ADMINISTRATOR' && '🟣 '}
                                    {admin.role === 'CITY_ADMINISTRATOR' && '🟢 '}
                                    {admin.role === 'SUPPORT' && '🔹 '}
                                    {getRoleName(admin.role)}
                                </span>
                                {admin.region && <span className={styles.regionBadge}>{admin.region}</span>}
                                {admin.city && <span className={styles.cityBadge}>{admin.city}</span>}
                            </div>
                            <div className={styles.badges}>
                                {admin.categories.map((category) => (
                                    <span key={`${admin.id}-${category}`} className={styles.badge}>
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            className={styles.deleteButton}
                            type="button"
                            onClick={() => handleDeleteAdmin(admin)}
                        >
                            Удалить
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

function getRoleName(role: string): string {
    switch (role) {
        case 'SUPERVISOR':
            return 'Супервизор';
        case 'REGION_ADMINISTRATOR':
            return 'Администратор области';
        case 'CITY_ADMINISTRATOR':
            return 'Администратор города';
        case 'SUPPORT':
            return 'Support';
        default:
            return role;
    }
}

export default AdminManagement;
