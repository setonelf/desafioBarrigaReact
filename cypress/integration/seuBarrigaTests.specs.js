/// <reference types="cypress"/>

describe('Work with alerts', ()=>{

    before(()=>{
        cy.visit('https://barrigareact.wcaquino.me')
    })

    it('Preparar dados',() =>{
        cy.get('[data-test=email]').type('1234@email.com')
        cy.get('[data-test=passwd]').type('1234')
        cy.get('.btn').click()
        cy.get('[data-test=menu-settings]').click()
        cy.get('[href="/reset"]').click()
        cy.get('.toast-success > .toast-message').should('contain', 'Dados resetados com sucesso!')
    })

    it('Inserir conta', ()=>{
        cy.get('[data-test=menu-settings]').click()
        cy.get('[href="/contas"]').click()
        cy.get('[data-test=nome]').type('Conta qualquer')
        cy.get('.btn').click()
        cy.get('.toast-success > .toast-message').should('contain', 'Conta inserida com sucesso!')
    })

    it('Inserir conta repetida', ()=>{
        cy.get('[data-test=menu-settings]').click()
        cy.get('[href="/contas"]').click()
        cy.get('[data-test=nome]').type('Conta qualquer')
        cy.get('.btn').click()
        cy.get('.toast-message').should('contain', 'Erro: Error: Request failed with status code 400')
    })
    
    it('Alterar conta', ()=>{
        cy.xpath('//td[contains(.,"Conta qualquer")]/following-sibling::td/a/i[@class="far fa-edit"]').click()
        cy.get('[data-test=nome]').clear().type("Conta Alterada")
        cy.get('.btn').click()
        cy.get('.toast-success > .toast-message').should('contain', 'Conta atualizada com sucesso!')
    })

    it('Inserir movimentação', ()=>{
        cy.get('[data-test=menu-movimentacao]').click()
        cy.get('[data-test=tipo-receita] > .fas').click()
        cy.get('[data-test=descricao]').type("teste")
        cy.get('[data-test=valor]').type("1000")
        cy.get('[data-test=envolvido]').type("Fulano")
        cy.get('[data-test=conta]').select("Conta Alterada")
        cy.get('[data-test=status]').click()
        cy.get('.btn-primary').click()
        cy.get('.toast-success > .toast-message').should('contain', 'Movimentação inserida com sucesso!')
        cy.xpath('//span[contains(.,"teste")]').should('contain', 'teste')
        cy.xpath('//span[contains(.,"teste")]/following-sibling::small').should('contain', '1.000')
        cy.xpath('//span[contains(.,"teste")]/../following-sibling::div[1]/small[1]').should('contain', 'Fulano')
        cy.xpath('//span[contains(.,"teste")]/../following-sibling::div[1]/small[2]').should('contain', 'Conta Alterada')
    })

    it('Cálculo de saldo', ()=>{
        cy.xpath('//a[@data-test="menu-home"]').click()
        //cy.xpath('//td[contains(.,"Conta Alterada")]/following-sibling::td"]',{timeout: 10000}).should('exist')
        //cy.xpath('//td[contains(.,"Conta Alterada")]/following-sibling::td"]',{timeout: 10000}).should('not.exist')
        //cy.wait(5000)
        cy.xpath('//td[contains(., "Conta Alterada")]/following-sibling::td',{timeout: 10000}).then(($td1)=>{
            
            cy.xpath('//b/../following-sibling::td',{timeout: 10000}).then(($td2)=>{
                
                cy.get('[data-test=menu-movimentacao]').click()
                cy.get('[data-test=tipo-receita] > .fas').click()
                cy.get('[data-test=descricao]').type("teste2")
                cy.get('[data-test=valor]').type("500")
                cy.get('[data-test=envolvido]').type("Ciclano")
                cy.get('[data-test=conta]').select("Conta Alterada")
                cy.get('[data-test=status]').click()
                cy.get('.btn-primary').click()

                cy.xpath('//a[@data-test="menu-home"]').click()

                cy.xpath('//td[contains(., "Conta Alterada")]/following-sibling::td',{timeout: 10000}).should(($td3)=>{
                    expect($td3.text()).be.equal("R$ 1.500,00")
                    
                })
                cy.xpath('//b/../following-sibling::td',{timeout: 10000}).should(($td4)=>{
                    
                    expect($td4.text()).be.equal("-R$ 1.186,00")
                })
                
            })

        })
        
        
        
    })

    it('Remover Movimentação', ()=>{
        cy.xpath('//td[contains(., "Conta Alterada")]/following-sibling::td',{timeout: 10000}).then(($td1)=>{   
            cy.get('[data-test=menu-extrato] > .fas').click()
            cy.xpath('//span[contains(., "teste2")]/../../following-sibling::div/a[2]',{timeout: 10000}).click()
            cy.get('.toast-success > .toast-message',{timeout: 10000}).should('contain', 'Movimentação removida com sucesso!')
            cy.xpath('//a[@data-test="menu-home"]').click()
            cy.xpath('//td[contains(., "Conta Alterada")]/following-sibling::td',{timeout: 10000}).then(($td2)=>{
                expect($td2.text()).be.equal("R$ 1.000,00")
            })
        })
    })

})