document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Quanto menor, mais rápido o contador

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer para disparar apenas quando visível
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect(); // Executa apenas uma vez
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);

    // Controle do Slider de Banners (Definido globalmente no objeto window)
    window.scrollSlider = function(direction) {
        const slider = document.querySelector('.banner-slider');
        if (slider) {
            const scrollAmount = slider.clientWidth * direction;
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Funções do Modal de Cadastro
    window.abrirModal = function(nomePlano) {
        const modal = document.getElementById('modal-cadastro');
        const inputPlano = document.getElementById('plano-escolhido');
        
        if (modal && inputPlano) {
            inputPlano.value = nomePlano;
            modal.style.display = 'flex';
        }
    };

    window.fecharModal = function() {
        const modal = document.getElementById('modal-cadastro');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Fecha o modal ao clicar fora da caixa branca
    window.onclick = function(event) {
        const modal = document.getElementById('modal-cadastro');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Intercepta o envio do formulário: Envia os dados para o e-mail e redireciona para o Pagamento
    const formulario = document.getElementById('form-cadastro');

    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(formulario);
            const planoSelecionado = document.getElementById('plano-escolhido').value;

            // Envio assíncrono para o Web3Forms (para cair no seu e-mail)
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirecionamento de acordo com o plano escolhido
                    if (planoSelecionado === 'PDV + Suporte Mensal') {
                        window.location.href = "https://www.mercadopago.com.br/seu-link-mensal-aqui";
                    } else {
                        window.location.href = "https://www.mercadopago.com.br/seu-link-pontual-aqui";
                    }
                } else {
                    alert('Houve um erro ao registrar seus dados. Tente novamente.');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro de conexão. Verifique sua internet.');
            });
        });
    }
});