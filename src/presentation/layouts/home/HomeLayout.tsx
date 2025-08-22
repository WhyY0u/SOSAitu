
import Background from "@/presentation/renderutils/background/Background";
import Header from "./header/Header";

const Home = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            <Background >
                <header>
                    <Header />
                </header>
                <main>{children}</main>
            </Background>
        </>
    );
};

export default Home;
