
import Background from "@/presentation/renderutils/background/Background";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
        <Background >
        <main>{children}</main>
        </Background>
        </>
    );
};

export default DefaultLayout;
