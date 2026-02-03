import { useEffect, useMemo, useState } from 'react';
import ApiUserRepository from '@/data/repositories/user/remote/ApiUserRepository';
import styles from './style/Style.module.css';

type AdminRecord = {
    id: number;
    fullName: string;
    categories: string[];
};

const fallbackCategories = [
    'Ветеран ВОВ',
    'Ветеран боевых действий',
    'Кандас',
    'Люди с инвалидностью',
];

const AdminManagement = () => {
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [fullName, setFullName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [admins, setAdmins] = useState<AdminRecord[]>([]);
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
                    fullName: a.user.fullName ?? '', // если null, заменяем на пустую строку
                    categories: a.responsible ?? [],
                }))
                );

            } catch {
                setAllCategories(fallbackCategories);
            }
        };
        loadData();
    }, [api]);

    const availableCategories = useMemo(() => allCategories.length ? allCategories : fallbackCategories, [allCategories]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category]
        );
    };

    // Добавление администратора через API
    const handleAddAdmin = async () => {
        const normalizedName = fullName.trim();
        if (!normalizedName || selectedCategories.length === 0) return;

        try {
            // Запрос на бэкенд
            const response = await api.addAdministrator({
                id: normalizedName, // Если на бэке ждут ID пользователя
                types: selectedCategories,
            });

            // Обновляем список из ответа
            setAdmins(prev => [
                ...prev,
                {
                    id: response.id,
                    fullName: response.user.fullName ?? '', // заменяем null на ''
                    categories: response.responsible ?? [],
                },
                ]);


            setFullName('');
            setSelectedCategories([]);
        } catch (err) {
            console.error('Ошибка при добавлении администратора:', err);
        }
    };

    // Удаление администратора через API
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
                <p className={styles.subtitle}>Добавьте администратора и назначьте одну или несколько категорий</p>

                <label className={styles.label}>
                    ID администратора
                    <input
                        className={styles.input}
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Например, 99831"
                    />
                </label>

                <div className={styles.categoriesBlock}>
                    <p className={styles.categoriesTitle}>Категории ответственности</p>
                    <div className={styles.categoriesList}>
                        {availableCategories.map((category) => (
                            <label key={category} className={styles.categoryItem}>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => toggleCategory(category)}
                                />
                                <span>{category}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    className={styles.addButton}
                    type="button"
                    onClick={handleAddAdmin}
                    disabled={!fullName.trim() || selectedCategories.length === 0}
                >
                    Добавить администратора
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

export default AdminManagement;
