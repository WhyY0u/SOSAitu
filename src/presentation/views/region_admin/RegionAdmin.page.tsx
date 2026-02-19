import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './styles/Style.module.css';
import type { RegionAdminAnalyticsResponse, CityAdministrator, City, CityStatistics } from '@/domain/repositories/region_admin/RegionAdminRepository';
import RegionAdminApiRepository from '@/data/repositories/region_admin/remote/ApiRegionAdminRepository';

type ActiveSection = 'analytics' | 'insights' | 'report' | 'admins';

const RegionAdmin = () => {
    const [activeSection, setActiveSection] = useState<ActiveSection>('analytics');
    const [analytics, setAnalytics] = useState<RegionAdminAnalyticsResponse | null>(null);
    const [report, setReport] = useState<string>('');
    const [insights, setInsights] = useState<string>('');
    const [cityAdmins, setCityAdmins] = useState<CityAdministrator[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [citiesStats, setCitiesStats] = useState<CityStatistics[]>([]);
    const [selectedCityStats, setSelectedCityStats] = useState<CityStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [selectedCityId, setSelectedCityId] = useState<string>('');
    const [generatingInsights, setGeneratingInsights] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);

    const api = new RegionAdminApiRepository();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('=== RegionAdmin Page: Start fetching data ===');
                
                const analyticsData = await api.getAnalytics();
                console.log('Analytics response:', analyticsData);
                setAnalytics(analyticsData);

                console.log('Fetching cities statistics...');
                const citiesStatsData = await api.getCitiesStatistics();
                console.log('Cities stats response:', citiesStatsData);
                setCitiesStats(Array.isArray(citiesStatsData) ? citiesStatsData : []);

                console.log('Fetching city administrators...');
                const adminsData = await api.getCityAdministrators();
                console.log('City admins response:', adminsData);
                setCityAdmins(Array.isArray(adminsData) ? adminsData : []);

                console.log('Fetching cities...');
                const citiesData = await api.getCities();
                console.log('Cities response:', citiesData);
                setCities(Array.isArray(citiesData) ? citiesData : []);

                if (citiesData.length === 0) {
                    console.warn('Города не загружены! Проверьте, назначен ли регион администратору.');
                }
                
                console.log('=== RegionAdmin Page: Data fetching complete ===');
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                console.error('Error details:', err.response?.data || err.message);
                console.error('Error status:', err.response?.status);
                setCityAdmins([]);
                setCities([]);
                setCitiesStats([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // AI-инсайты генерируются только по кнопке, не автоматически

    const handleGenerateInsights = async () => {
        setGeneratingInsights(true);
        try {
            const insightsData = await api.getInsights();
            setInsights(insightsData);
        } catch (err) {
            console.warn('AI insights недоступны:', err);
            setInsights('Не удалось сгенерировать аналитику');
        } finally {
            setGeneratingInsights(false);
        }
    };

    const handleGenerateReport = async () => {
        setGeneratingReport(true);
        try {
            const reportData = await api.getMonthlyReport();
            setReport(reportData);
        } catch (err) {
            console.warn('AI отчет недоступен:', err);
            setReport('Не удалось сгенерировать отчет');
        } finally {
            setGeneratingReport(false);
        }
    };

    const handleOpenAddModal = () => {
        setShowAddModal(true);
    };

    const handleAddCityAdmin = async () => {
        if (!userId || !selectedCityId) {
            alert('Введите ID пользователя и выберите город');
            return;
        }

        try {
            await api.addCityAdministrator(
                parseInt(userId),
                parseInt(selectedCityId)
            );
            setShowAddModal(false);
            setUserId('');
            setSelectedCityId('');
            
            // Обновляем список
            const adminsData = await api.getCityAdministrators();
            setCityAdmins(adminsData);
        } catch (err) {
            console.error('Ошибка при добавлении:', err);
            alert('Ошибка при добавлении администратора. Проверьте ID пользователя.');
        }
    };

    const handleDeleteCityAdmin = async (userId: number) => {
        if (!confirm('Вы уверены, что хотите удалить этого администратора?')) {
            return;
        }

        try {
            await api.deleteCityAdministrator(userId);
            const adminsData = await api.getCityAdministrators();
            setCityAdmins(adminsData);
        } catch (err) {
            console.error('Ошибка при удалении:', err);
            alert('Ошибка при удалении администратора');
        }
    };

    if (loading) {
        return <div className={styles.main_container}>Загрузка...</div>;
    }

    return (
        <div className={styles.main_container}>
            <p className={styles.text_one}>Панель администратора области</p>
            <p className={styles.text_two}>Управление и аналитика по вашей области</p>

            <div className={styles.menu}>
                <button
                    className={`${styles.menu_button} ${activeSection === 'analytics' ? styles.active : ''}`}
                    onClick={() => setActiveSection('analytics')}
                >
                    📊 Аналитика
                </button>
                <button
                    className={`${styles.menu_button} ${activeSection === 'insights' ? styles.active : ''}`}
                    onClick={() => setActiveSection('insights')}
                >
                    💡 AI-инсайты
                </button>
                <button
                    className={`${styles.menu_button} ${activeSection === 'report' ? styles.active : ''}`}
                    onClick={() => setActiveSection('report')}
                >
                    📋 AI-отчет
                </button>
                <button
                    className={`${styles.menu_button} ${activeSection === 'admins' ? styles.active : ''}`}
                    onClick={() => setActiveSection('admins')}
                >
                    👥 Администраторы
                </button>
            </div>

            {activeSection === 'analytics' && analytics && (
                <div className={styles.analytics_card}>
                    <div className={styles.card_header}>
                        <h2 className={styles.analytics_title}>📊 Статистика по области</h2>
                        <p className={styles.analytics_subtitle}>{analytics.regionName}</p>
                    </div>

                    <div className={styles.stats_grid}>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>📬</div>
                            <div className={styles.stat_label}>Всего обращений</div>
                            <div className={styles.stat_value}>{analytics.totalTickets}</div>
                        </div>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>📅</div>
                            <div className={styles.stat_label}>За месяц</div>
                            <div className={styles.stat_value}>{analytics.ticketsMonth}</div>
                        </div>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>⚠️</div>
                            <div className={styles.stat_label}>Проблемных</div>
                            <div className={styles.stat_value}>{analytics.problemTickets}</div>
                        </div>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>⏱️</div>
                            <div className={styles.stat_label}>Ср. время ответа</div>
                            <div className={styles.stat_value}>{analytics.avgResponseTime} ч</div>
                        </div>
                        <div className={styles.stat_card}>
                            <div className={styles.stat_icon}>⭐</div>
                            <div className={styles.stat_label}>Удовлетворённость</div>
                            <div className={styles.stat_value}>{analytics.satisfactionScore}</div>
                        </div>
                    </div>

                    {analytics.categoryStats && analytics.categoryStats.length > 0 && (
                        <div className={styles.category_stats}>
                            <h3 className={styles.category_title}>📂 Распределение по категориям</h3>
                            <div className={styles.category_grid}>
                                {analytics.categoryStats.map((stat) => (
                                    <div key={stat.type} className={styles.category_item}>
                                        <span className={styles.category_name}>{stat.type}</span>
                                        <span className={styles.category_count}>{stat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Статистика по городам */}
                    {citiesStats.length > 0 && (
                        <div className={styles.cities_stats_section}>
                            <h3 className={styles.cities_stats_title}>🏙️ Статистика по городам</h3>
                            <div className={styles.cities_grid}>
                                {citiesStats.map((cityStat) => (
                                    <div 
                                        key={cityStat.cityId} 
                                        className={styles.city_stat_card}
                                        onClick={() => setSelectedCityStats(cityStat)}
                                    >
                                        <div className={styles.city_stat_header}>
                                            <span className={styles.city_stat_icon}>🏛️</span>
                                            <h4 className={styles.city_stat_name}>{cityStat.cityName}</h4>
                                        </div>
                                        <div className={styles.city_stat_grid}>
                                            <div className={styles.city_stat_item}>
                                                <span className={styles.city_stat_label}>Всего:</span>
                                                <span className={styles.city_stat_value}>{cityStat.totalTickets}</span>
                                            </div>
                                            <div className={styles.city_stat_item}>
                                                <span className={styles.city_stat_label}>За месяц:</span>
                                                <span className={styles.city_stat_value}>{cityStat.ticketsMonth}</span>
                                            </div>
                                            <div className={styles.city_stat_item}>
                                                <span className={styles.city_stat_label}>Проблемных:</span>
                                                <span className={styles.city_stat_value_problem}>{cityStat.problemTickets}</span>
                                            </div>
                                            <div className={styles.city_stat_item}>
                                                <span className={styles.city_stat_label}>Время:</span>
                                                <span className={styles.city_stat_value}>{cityStat.avgResponseTime} ч</span>
                                            </div>
                                        </div>
                                        <div className={styles.city_stat_footer}>
                                            <span className={styles.city_stat_satisfaction}>⭐ {cityStat.satisfactionScore}</span>
                                            <span className={styles.city_stat_view_more}>Подробнее →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'insights' && (
                <div className={styles.analytics_card}>
                    <div className={styles.card_header}>
                        <h2 className={styles.analytics_title}>💡 AI-инсайты по области</h2>
                        <button
                            onClick={handleGenerateInsights}
                            disabled={generatingInsights}
                            className={`${styles.ai_button} ${generatingInsights ? styles.disabled : ''}`}
                        >
                            {generatingInsights ? '⏳ Генерация...' : '🔄 Сгенерировать заново'}
                        </button>
                    </div>
                    {insights ? (
                        <div className={styles.ai_report}>
                            <div className={styles.ai_report_content}>
                                <ReactMarkdown>{insights}</ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.empty_state}>
                            Нажмите кнопку для генерации AI-инсайтов
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'report' && (
                <div className={styles.analytics_card}>
                    <div className={styles.card_header}>
                        <h2 className={styles.analytics_title}>📋 AI-отчет за месяц</h2>
                        <button
                            onClick={handleGenerateReport}
                            disabled={generatingReport}
                            className={`${styles.ai_button} ${generatingReport ? styles.disabled : ''}`}
                        >
                            {generatingReport ? '⏳ Генерация...' : '🤖 Сгенерировать отчет'}
                        </button>
                    </div>
                    {report ? (
                        <div className={styles.ai_report}>
                            <div className={styles.ai_report_content}>
                                <ReactMarkdown>{report}</ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.empty_state}>
                            Нажмите кнопку для генерации отчета
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'admins' && (
                <div className={styles.analytics_card}>
                    <h2 className={styles.analytics_title}>📋 Администраторы городов</h2>
                    
                    <button 
                        className={styles.add_button}
                        onClick={handleOpenAddModal}
                    >
                        + Добавить администратора
                    </button>

                    <div className={styles.admins_list}>
                        {cityAdmins.length === 0 ? (
                            <div className={styles.empty_state}>
                                <p>Администраторов пока нет</p>
                            </div>
                        ) : (
                            cityAdmins.map((admin) => (
                                <div key={admin.id} className={styles.admin_item}>
                                    <div>
                                        <div className={styles.admin_name}>{admin.fullName}</div>
                                        <div className={styles.admin_city}>
                                            📍 {admin.city || 'Не назначен'}
                                        </div>
                                        <div className={styles.admin_category}>
                                            Категории: {admin.responsible.join(', ')}
                                        </div>
                                    </div>
                                    <div className={styles.admin_stats}>
                                        <span className={admin.status === 'Онлайн' || admin.status === 'Online' ? styles.status_online : styles.status_offline}>
                                            {admin.status === 'Онлайн' || admin.status === 'Online' ? '🟢' : '🔴'} {admin.status}
                                        </span>
                                    </div>
                                    <div className={styles.admin_actions}>
                                        <button 
                                            className={styles.delete_button}
                                            onClick={() => handleDeleteCityAdmin(admin.id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className={styles.modal_overlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modal_title}>Добавить администратора города</h3>

                        <div className={styles.form_group}>
                            <label className={styles.form_label}>ID пользователя</label>
                            <input
                                type="number"
                                className={styles.form_input}
                                placeholder="Введите ID пользователя"
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label className={styles.form_label}>Город</label>
                            {cities.length === 0 ? (
                                <div className={styles.no_cities}>
                                    ⚠️ Города не найдены. Убедитесь, что ваш регион настроен.
                                </div>
                            ) : (
                                <select
                                    className={styles.form_select}
                                    value={selectedCityId}
                                    onChange={e => setSelectedCityId(e.target.value)}
                                >
                                    <option value="">Выберите город</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className={styles.modal_actions}>
                            <button
                                className={styles.cancel_button}
                                onClick={() => setShowAddModal(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className={styles.submit_button}
                                onClick={handleAddCityAdmin}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно детальной статистики по городу */}
            {selectedCityStats && (
                <div className={styles.modal_overlay} onClick={() => setSelectedCityStats(null)}>
                    <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
                        <div className={styles.city_detail_header}>
                            <h3 className={styles.city_detail_title}>🏛️ {selectedCityStats.cityName}</h3>
                            <button
                                className={styles.close_button}
                                onClick={() => setSelectedCityStats(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.city_detail_stats}>
                            <div className={styles.city_detail_stat}>
                                <span className={styles.city_detail_label}>📬 Всего обращений</span>
                                <span className={styles.city_detail_value}>{selectedCityStats.totalTickets}</span>
                            </div>
                            <div className={styles.city_detail_stat}>
                                <span className={styles.city_detail_label}>📅 За месяц</span>
                                <span className={styles.city_detail_value}>{selectedCityStats.ticketsMonth}</span>
                            </div>
                            <div className={styles.city_detail_stat}>
                                <span className={styles.city_detail_label}>⚠️ Проблемных</span>
                                <span className={styles.city_detail_value_problem}>{selectedCityStats.problemTickets}</span>
                            </div>
                            <div className={styles.city_detail_stat}>
                                <span className={styles.city_detail_label}>⏱️ Ср. время ответа</span>
                                <span className={styles.city_detail_value}>{selectedCityStats.avgResponseTime} ч</span>
                            </div>
                            <div className={styles.city_detail_stat}>
                                <span className={styles.city_detail_label}>⭐ Удовлетворённость</span>
                                <span className={styles.city_detail_value}>{selectedCityStats.satisfactionScore}</span>
                            </div>
                        </div>

                        {selectedCityStats.categoryStats && selectedCityStats.categoryStats.length > 0 && (
                            <div className={styles.city_detail_categories}>
                                <h4 className={styles.city_detail_categories_title}>📂 Категории обращений</h4>
                                <div className={styles.city_detail_categories_list}>
                                    {selectedCityStats.categoryStats.map((stat) => (
                                        <div key={stat.type} className={styles.city_detail_category_item}>
                                            <span className={styles.city_detail_category_name}>{stat.type}</span>
                                            <span className={styles.city_detail_category_count}>{stat.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegionAdmin;
