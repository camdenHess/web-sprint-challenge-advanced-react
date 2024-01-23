// Write your tests here
import server from '../../backend/mock-server'
import React from 'react'
import AppFunctional from "./AppFunctional"
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('AppFunctional component', () => {
  let emailBox = document.querySelector('#email')

  beforeAll(() => { server.listen() })
  afterAll(() => { server.close() })
  beforeEach(() => {
    render(<AppFunctional />)
  })

  test('UP', () => {
    expect(screen.getByText('UP')).toBeVisible()
  })

  test('DOWN', () => {
    expect(screen.getByText('DOWN')).toBeVisible()
  })

  test('RIGHT', () => {
    expect(screen.getByText('RIGHT')).toBeVisible()
  })

  test('LEFT', () => {
    expect(screen.getByText('LEFT')).toBeVisible()
  })
})

